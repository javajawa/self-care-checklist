'use strict';

Storage.prototype.putValue = function( k, v ) {
	this.setItem( k, JSON.stringify( v ) );
};

Storage.prototype.getValue = function( k ) {
	return JSON.parse( this.getItem( k ) || 'null' );
};

export const storage = window.localStorage;
