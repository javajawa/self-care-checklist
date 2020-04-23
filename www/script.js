'use strict';

import { storage }       from './storage.js';
import { defaultCards }  from './default.js';
import { elemGenerator } from 'https://javajawa.github.io/elems.js/elems.js';

const section = elemGenerator( 'section' );
const label   = elemGenerator( 'label' );
const input   = elemGenerator( 'input' );
const anchor  = elemGenerator( 'a' );

document.addEventListener( 'change', e =>
	e.target.id && e.target.type == 'checkbox' &&
	storage.putValue( e.target.id, e.target.checked )
);

let activeCards = {};
let controls;

function cardHash(cardText)
{
	let hash;

	for ( let i = 0; i < cardText.length; i++ )
	{
		hash = Math.imul(31, hash) + cardText.charCodeAt(i) | 0;
	}

	return "card" + hash;
}

function addCard(cardText)
{
	const hash      = cardHash(cardText);
	const isChecked = !!storage.getValue( hash );

	if (hash in activeCards)
	{
		return false;
	}

	activeCards[hash] = cardText;

	document.body.insertBefore(
		input( { type: 'checkbox', id: hash, checked: isChecked } ),
		controls
	);
	document.body.insertBefore(
		label(
			{ 'for': hash },
			anchor( { 'class': 'delete-card', click: e => removeCard( hash ) }, '×' ),
			cardText
		),
		controls
	);

	return true;
}

function removeCard(cardHash)
{
	if (!(cardHash in activeCards))
	{
		return;
	}

	document.body.removeChild(document.getElementById(cardHash));
	document.body.removeChild(document.querySelector('[for="' + cardHash + '"]'));

	delete activeCards[cardHash];

	storeCardList();
}

function storeCardList()
{
	storage.putValue( 'cards', Object.values( activeCards ) );
}

function init()
{
	if ( document.readyState !== "complete" ) return false;

	const storedCards = storage.getValue('cards') || defaultCards;

	controls = section(
		{id: 'controls'},
		label(
			'Add',
			{
				click: e => addCard(prompt('New Card')) && storeCardList()
			}
		),
		label(
			'Reset',
			{
				click: e => document.querySelectorAll( 'input[type="checkbox"]' )
					.forEach(
						i =>
						{
							i.checked = false;
							storage.putValue( i.id, false )
						}
					)
			}
		)
	);

	document.body.appendChild( controls );

	storedCards.forEach( addCard );
	storeCardList();

	return true;
}

init() || document.addEventListener( 'readystatechange', init );
