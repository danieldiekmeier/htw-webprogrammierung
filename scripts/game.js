var cards = new Array();
var COLORS = ['Kreuz', 'Pik', 'Herz', 'Karo'];
var TYPES = ['Ass', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Bube', 'Dame', 'König'];
var TYPE_CLASSNAMES = ['ace', 'value-2', 'value-3', 'value-4', 'value-5', 'value-6', 'value-7', 'value-8', 'value-9', 'value-10', 'jack', 'queen', 'king'];
var row_offset = 0;

function end_game() {
	var top_card_element = document.getElementById('pile_unused').children[0];
	top_card_element.removeEventListener('mousedown', play, false);
	top_card_element.className = top_card_element.className + ' finished';

	var notification_center = document.getElementById('notification_center');
	var replay_button = document.createElement('button');
	replay_button.className = 'replay_button';
	replay_button.innerHTML = 'Nochmal';
	replay_button.addEventListener('click', reset_table, false);

	notification_center.appendChild(replay_button);
}

function table_setup() {

	for (var i = 0; i < 52; i++) {
		var card = new Object;
		var modulo = i % 13;
		card.type = TYPES[modulo];
		card.type_classname = TYPE_CLASSNAMES[modulo];
		card.color = COLORS[Math.floor(i / 13)]
		card.value = ((modulo)+1 <= 10) ? (modulo)+1 : 10;
		cards.push(card);
	};
	shuffle(cards);

	var pile_unused_element = document.getElementById('pile_unused');
	for (var i = 0; i <= cards.length - 1; i++) {
		card = cards[i];
		console.log(card.type + ' ' + card.color);

		var card_element = document.createElement('div');
		card_element.card = card;
		card_element.className = 'card turned ' + card.type_classname + ' ' + card.color.toLowerCase();
		if (card.type != 10) {
			card_element.setAttribute('data-type-symbol', card.type.charAt(0));
		} else {
			card_element.setAttribute('data-type-symbol', 10);
		}

		card_element.style.zIndex = cards.length-i+1;
		card_element.addEventListener('mousedown', play, false);

		pile_unused_element.appendChild(card_element);
	};

}

function reset_table() {
	var pile_unused_element = document.getElementById('pile_unused');
	pile_unused_element.innerHTML = '';

	var cards_player_element = document.getElementById('cards_player');
	cards_player_element.innerHTML = '';
	var cards_dealer_element = document.getElementById('cards_dealer');
	cards_dealer_element.innerHTML = '';

	var score_player_element = document.getElementById('score_player');
	score_player_element.innerHTML = '0';
	var score_dealer_element = document.getElementById('score_dealer');
	score_dealer_element.innerHTML = '0';

	var notification_center_element = document.getElementById('notification_center');
	notification_center_element.innerHTML = '';

	cards = new Array();
	row_offset = 0;

	setTimeout(table_setup, 10);
}

function play() {
	turn(this);
	var next_card = this.nextSibling;
	pick_card(this, 'player');

	setTimeout(function() {
		turn(next_card);
		pick_card(next_card, 'dealer');
	}, 250);

	set_scores();

	row_offset = row_offset + 100;
}

function pick_card(card_element, player) {
	// elements that i'll need
	var pile_unused_element = document.getElementById('pile_unused');
	var cards_player_element = document.getElementById('cards_'+player);

	// calculate delta between pile and player's row
	var cards_player_element_offset = cards_player_element.getBoundingClientRect();
	var card_offset = card_element.getBoundingClientRect();
	var delta_left = card_offset.left - cards_player_element_offset.left;
	var delta_top = card_offset.top - cards_player_element_offset.top;

	// remove the card from the pile
	pile_unused_element.removeChild(card_element);

	// set offset so it appears to be on same position
	card_element.style.left = delta_left-3 +'px';
	card_element.style.top = delta_top-3 +'px';
	card_element.style.zIndex = row_offset+100;

	// put the card on the row
	cards_player_element.appendChild(card_element);


	setTimeout(function() {
		// set to final location
		card_element.style.left = row_offset-100-3 +'px';
		card_element.style.top = '-3px';
	}, 1);
}

function set_scores() {
	set_score('player');
	setTimeout(function() {
		set_score('dealer');
	}, 500);
}

function set_score(player) {
	var cards_player_element = document.getElementById('cards_'+player);
	var card_elements = cards_player_element.children;
	var score = 0;
	for (var i = 0; i <= card_elements.length - 1; i++) {
		var card_element = card_elements[i];
		console.log( card_element.card.value );
		score = score + card_element.card.value;
	};
	var score_player_element = document.getElementById('score_'+player);
	score_player_element.innerHTML = score;

	var notification_center = document.getElementById('notification_center');
	if ((score > 21 && player == 'player') || (score == 21 && player == 'dealer')) {
		notification_center.innerHTML = 'Du hast verloren';
		end_game();
	} else if ((score > 21 && player == 'dealer') || (score == 21 && player == 'player')) {
		notification_center.innerHTML = 'Du hast gewonnen';
		end_game();
	}
}

function shuffle(cards) {
	for (var i = cards.length - 1; i >= 0; i--) {
		var temp_card = cards[i];
		var temp_index = Math.floor(Math.random() * cards.length);
		cards[i] = cards[temp_index];
		cards[temp_index] = temp_card;
	};
	return cards;
};

function turn(card_element) {
	card_element.className = card_element.className.replace('turned ', '');
}

// WHERE THE MAGIC HAPPENS

table_setup();