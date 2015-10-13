<?php
/**
 * @package ARCW_Popover
 * @version 0.1.0
 */
/*
Plugin Name: ARCW Popover Addon
Plugin URI: http://labs.alek.be/
Description: Shows a popover on Calendar Archives Widget day/month hover.
Version: 0.1.0
Author: Aleksei Polechin (alek´)
Author URI: http://alek.be
License: GPLv3
*/

/***** GPLv3 LICENSE *****
 *
 * Archives Calendar Widget - Popover Addon
 * Copyright (C) 2013 Aleksei Polechin (http://alek.be)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 ****/

define( 'ARCWPV', '0.1.0' ); // current version of the plugin
define( 'ARCWP_DEBUG', false ); // enable or disable debug (for dev instead of echo or print_r use debug() function)
define( 'ARCWP_DIR', plugins_url( '/', __FILE__ ) );

add_action( 'init', 'arcwp_init' );

function arcwp_init() {
	if ( ! defined( 'ARCWV' ) || is_admin() ) {
		return;
	}
	wp_enqueue_script(
		'arcwp-script',
		ARCWP_DIR.'arcw-popover.min.js',
		array( 'jquery' ),
		ARCWPV
	);


	wp_register_style( 'arcwp-style', ARCWP_DIR.'/arcw-popover.css', array(), ARCWPV );
	wp_enqueue_style( 'arcwp-style' );

	wp_localize_script( 'arcwp-script', 'ajaxurl', admin_url( 'admin-ajax.php' ) );
}

add_action( 'wp_ajax_get_archives_list', 'arcwp_get_archives_list' );
add_action( 'wp_ajax_nopriv_get_archives_list', 'arcwp_get_archives_list' );

function arcwp_get_archives_list() {
	global $wpdb;

	$wpurl = get_bloginfo( 'url' );
	$url   = $_POST['link'];

	$link    = str_replace( "$wpurl", '', $url );
	$link    = parse_url( $link );
	$arcdate = explode( '/', substr( $link['path'], 1, - 1 ) );

	$cat       = '';
	$post_type = 'post';

	if ( isset( $link['query'] ) ) {
		parse_str( $link['query'], $params );

		$cat       = isset( $params['c'] ) ? $params['c'] : '';
		$post_type = isset( $params['p'] ) ? explode( ',', $params['p'] ) : 'post';
	}

	$args = array(
		'posts_per_page'   => 0,
		'cat'              => $cat,
		'orderby'          => 'date',
		'order'            => 'DESC',
		'post_type'        => $post_type,
		'post_status'      => 'publish',
		'suppress_filters' => true,
		'date_query'       => array(
			array(
				'year'  => $arcdate[0],
				'month' => $arcdate[1],
				'day'   => isset ( $arcdate[2] ) ? $arcdate[2] : null,
			)
		)
	);

	if(!empty($cat)) {
		$args['tax_query'] = array(
			'relation' => 'AND',
			array(
				'taxonomy' => 'category',
				'field'    => 'term_id',
				'terms'    => explode(',', $cat),
				'operator' => 'IN',
			),
		);
	}

	$posts_array = get_posts( $args );

	$max   = 5;
	$posts = count( $posts_array );

	echo "<ul>";
	for ( $i = 0; $i < $posts && $i < $max; $i ++ ) {
		$post = $posts_array[ $i ];
		echo '<li><a href="' . get_post_permalink( $post->ID ) . '">' . $post->post_title . '</a></li>';
	}
	if ( $posts > $max ) {
		echo '<li><a class="arcwp-more" href="' . $url . '">' . __( 'More' ) . '</a></li>';
	}
	echo "</ul>";

	die();
}

