import React, { Component } from 'react';
import styled from 'styled-components';

import { InfoMessagesQueue } from './util/infoMessagesQueue';
import { getWinner, getScore } from './util/engine.js';
import { clonePlayerData, shouldHighlight, addToTableCards, addTheseCardsToTableCards } from './util/helpers';
import { deck } from './util/deck.js'; // this is the initialized deck instance

import axios from 'axios';
import PlayerDashboard from './components/PlayerDashboard';
import Table from './components/Table.js';
import AI from './components/AI';

/* STYLED COMPONENTS */

const StyledPoker = styled.div`
  padding-top: 10px;
  margin: 0 auto;
  max-width: 1000px;
  color: white;
  display: grid;
  width: 950px;
  grid-template-columns: 20% 60% 20%;
  grid-template-rows: 68px 130px 150px 200px;
  grid-row-gap: 10px;
  grid-template-areas:
    'infopanel infopanel infopanel'
    '. ai2 .'
    'ai1 table ai3'
    'player player player';
  background-color: rgb(0, 80, 0);
  border-radius: 20px;
`;

// todo: merge into playerData
const fullNames = {
  ai1: 'AI Opponent 1',
  ai2: 'AI Opponent 2',
  ai3: 'AI Opponent 3',
  player: 'Player',
};

const curatedGame = 
  JSON.parse("[{"+
  "\"id\": 0,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 10,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Clubs\"},{\"value\": 5,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Hearts\"},{\"value\": 11,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 2,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Clubs\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 14,\"suit\": \"Clubs\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 4,\"suit\": \"Clubs\"},"+
      "{\"value\": 5,\"suit\": \"Spades\"},"+
      "{\"value\": 14,\"suit\": \"Hearts\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 1,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 2,\"suit\": \"Diamonds\"},{\"value\": 10,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 8,\"suit\": \"Hearts\"},{\"value\": 3,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 7,\"suit\": \"Hearts\"},{\"value\": 7,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Clubs\"},{\"value\": 7,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 14,\"suit\": \"Diamonds\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 6,\"suit\": \"Diamonds\"},"+
      "{\"value\": 7,\"suit\": \"Spades\"},"+
      "{\"value\": 9,\"suit\": \"Hearts\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":true"+
"},{"+
  "\"id\": 2,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 5,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Clubs\"},{\"value\": 7,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Spades\"},{\"value\": 2,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Diamonds\"},{\"value\": 2,\"suit\": \"Diamonds\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 12,\"suit\": \"Spades\"},"+
      "{\"value\": 12,\"suit\": \"Hearts\"},"+
      "{\"value\": 2,\"suit\": \"Clubs\"},"+
      "{\"value\": 7,\"suit\": \"Clubs\"},"+
      "{\"value\": 8,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 3,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Diamonds\"},{\"value\": 11,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 9,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 5,\"suit\": \"Clubs\"},{\"value\": 4,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 6,\"suit\": \"Clubs\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 8,\"suit\": \"Spades\"},"+
      "{\"value\": 5,\"suit\": \"Spades\"},"+
      "{\"value\": 10,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 4,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Spades\"},{\"value\": 9,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Diamonds\"},{\"value\": 4,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Hearts\"},{\"value\": 6,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Spades\"},{\"value\": 8,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 13,\"suit\": \"Clubs\"},"+
      "{\"value\": 3,\"suit\": \"Clubs\"},"+
      "{\"value\": 11,\"suit\": \"Clubs\"},"+
      "{\"value\": 12,\"suit\": \"Hearts\"},"+
      "{\"value\": 10,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":true"+
"},{"+
  "\"id\": 5,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 8,\"suit\": \"Clubs\"},{\"value\": 8,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 5,\"suit\": \"Spades\"},{\"value\": 3,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Spades\"},{\"value\": 7,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 5,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 2,\"suit\": \"Diamonds\"},"+
      "{\"value\": 7,\"suit\": \"Clubs\"},"+
      "{\"value\": 6,\"suit\": \"Spades\"},"+
      "{\"value\": 7,\"suit\": \"Clubs\"},"+
      "{\"value\": 11,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 6,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Clubs\"},{\"value\": 2,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Clubs\"},{\"value\": 3,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 8,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Hearts\"},{\"value\": 8,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 11,\"suit\": \"Hearts\"},"+
      "{\"value\": 13,\"suit\": \"Diamonds\"},"+
      "{\"value\": 9,\"suit\": \"Hearts\"},"+
      "{\"value\": 7,\"suit\": \"Hearts\"},"+
      "{\"value\": 3,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 7,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Hearts\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 5,\"suit\": \"Spades\"},{\"value\": 4,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 14,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Spades\"},{\"value\": 6,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 5,\"suit\": \"Diamonds\"},"+
      "{\"value\": 10,\"suit\": \"Diamonds\"},"+
      "{\"value\": 12,\"suit\": \"Spades\"},"+
      "{\"value\": 5,\"suit\": \"Clubs\"},"+
      "{\"value\": 8,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 8,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Spades\"},{\"value\": 14,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Hearts\"},{\"value\": 10,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Spades\"},{\"value\": 4,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 3,\"suit\": \"Spades\"},{\"value\": 2,\"suit\": \"Diamonds\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 13,\"suit\": \"Hearts\"},"+
      "{\"value\": 7,\"suit\": \"Diamonds\"},"+
      "{\"value\": 8,\"suit\": \"Diamonds\"},"+
      "{\"value\": 4,\"suit\": \"Clubs\"},"+
      "{\"value\": 9,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 9,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 9,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Hearts\"},{\"value\": 5,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 8,\"suit\": \"Hearts\"},{\"value\": 7,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Diamonds\"},{\"value\": 13,\"suit\": \"Clubs\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 4,\"suit\": \"Diamonds\"},"+
      "{\"value\": 12,\"suit\": \"Hearts\"},"+
      "{\"value\": 7,\"suit\": \"Clubs\"},"+
      "{\"value\": 10,\"suit\": \"Hearts\"},"+
      "{\"value\": 3,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 10,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 7,\"suit\": \"Spades\"},{\"value\": 7,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Clubs\"},{\"value\": 6,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Spades\"},{\"value\": 4,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Spades\"},{\"value\": 5,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 9,\"suit\": \"Clubs\"},"+
      "{\"value\": 13,\"suit\": \"Hearts\"},"+
      "{\"value\": 11,\"suit\": \"Diamonds\"},"+
      "{\"value\": 4,\"suit\": \"Diamonds\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 11,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 11,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Clubs\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 8,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 5,\"suit\": \"Hearts\"},{\"value\": 4,\"suit\": \"Diamonds\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 2,\"suit\": \"Spades\"},"+
      "{\"value\": 12,\"suit\": \"Clubs\"},"+
      "{\"value\": 8,\"suit\": \"Spades\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 14,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 12,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Hearts\"},{\"value\": 12,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 3,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Spades\"},{\"value\": 8,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 10,\"suit\": \"Spades\"},"+
      "{\"value\": 12,\"suit\": \"Diamonds\"},"+
      "{\"value\": 8,\"suit\": \"Hearts\"},"+
      "{\"value\": 2,\"suit\": \"Hearts\"},"+
      "{\"value\": 14,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 13,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 13,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Hearts\"},{\"value\": 5,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Clubs\"},{\"value\": 11,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Hearts\"},{\"value\": 5,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 7,\"suit\": \"Diamonds\"},"+
      "{\"value\": 11,\"suit\": \"Hearts\"},"+
      "{\"value\": 3,\"suit\": \"Clubs\"},"+
      "{\"value\": 6,\"suit\": \"Clubs\"},"+
      "{\"value\": 2,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 14,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 7,\"suit\": \"Diamonds\"},{\"value\": 6,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 8,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Spades\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 5,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 9,\"suit\": \"Spades\"},"+
      "{\"value\": 12,\"suit\": \"Clubs\"},"+
      "{\"value\": 11,\"suit\": \"Diamonds\"},"+
      "{\"value\": 5,\"suit\": \"Diamonds\"},"+
      "{\"value\": 6,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 15,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Hearts\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 12,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Spades\"},{\"value\": 12,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 5,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 10,\"suit\": \"Spades\"},"+
      "{\"value\": 5,\"suit\": \"Hearts\"},"+
      "{\"value\": 13,\"suit\": \"Hearts\"},"+
      "{\"value\": 13,\"suit\": \"Spades\"},"+
      "{\"value\": 2,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 16,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 6,\"suit\": \"Hearts\"},{\"value\": 5,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Spades\"},{\"value\": 10,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Hearts\"},{\"value\": 6,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 8,\"suit\": \"Diamonds\"},{\"value\": 6,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 7,\"suit\": \"Hearts\"},"+
      "{\"value\": 8,\"suit\": \"Clubs\"},"+
      "{\"value\": 9,\"suit\": \"Diamonds\"},"+
      "{\"value\": 4,\"suit\": \"Spades\"},"+
      "{\"value\": 2,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 17,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 10,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Hearts\"},{\"value\": 12,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Clubs\"},{\"value\": 6,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 6,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 11,\"suit\": \"Diamonds\"},"+
      "{\"value\": 11,\"suit\": \"Spades\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 14,\"suit\": \"Hearts\"},"+
      "{\"value\": 13,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":true"+
"},{"+
  "\"id\": 18,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 13,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 8,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Hearts\"},{\"value\": 10,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Clubs\"},{\"value\": 5,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 13,\"suit\": \"Diamonds\"},"+
      "{\"value\": 14,\"suit\": \"Clubs\"},"+
      "{\"value\": 11,\"suit\": \"Spades\"},"+
      "{\"value\": 2,\"suit\": \"Hearts\"},"+
      "{\"value\": 10,\"suit\": \"Hearts\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 19,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Clubs\"},{\"value\": 7,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Hearts\"},{\"value\": 11,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Clubs\"},{\"value\": 2,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Diamonds\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 14,\"suit\": \"Hearts\"},"+
      "{\"value\": 7,\"suit\": \"Hearts\"},"+
      "{\"value\": 8,\"suit\": \"Diamonds\"},"+
      "{\"value\": 13,\"suit\": \"Diamonds\"},"+
      "{\"value\": 6,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":true"+
"},{"+
  "\"id\": 20,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Hearts\"},{\"value\": 7,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 3,\"suit\": \"Spades\"},{\"value\": 3,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Clubs\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Clubs\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 7,\"suit\": \"Diamonds\"},"+
      "{\"value\": 8,\"suit\": \"Diamonds\"},"+
      "{\"value\": 5,\"suit\": \"Diamonds\"},"+
      "{\"value\": 3,\"suit\": \"Clubs\"},"+
      "{\"value\": 9,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 21,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Diamonds\"},{\"value\": 4,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 3,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 9,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 6,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 13,\"suit\": \"Clubs\"},"+
      "{\"value\": 8,\"suit\": \"Diamonds\"},"+
      "{\"value\": 6,\"suit\": \"Spades\"},"+
      "{\"value\": 9,\"suit\": \"Clubs\"},"+
      "{\"value\": 6,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 22,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Clubs\"},{\"value\": 5,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 14,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Hearts\"},{\"value\": 11,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 2,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Clubs\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 5,\"suit\": \"Spades\"},"+
      "{\"value\": 4,\"suit\": \"Clubs\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 14,\"suit\": \"Clubs\"},"+
      "{\"value\": 14,\"suit\": \"Hearts\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 23,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 7,\"suit\": \"Hearts\"},{\"value\": 7,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 8,\"suit\": \"Hearts\"},{\"value\": 3,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 2,\"suit\": \"Diamonds\"},{\"value\": 10,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Clubs\"},{\"value\": 7,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 7,\"suit\": \"Spades\"},"+
      "{\"value\": 14,\"suit\": \"Diamonds\"},"+
      "{\"value\": 6,\"suit\": \"Diamonds\"},"+
      "{\"value\": 9,\"suit\": \"Hearts\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 24,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Spades\"},{\"value\": 2,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Clubs\"},{\"value\": 7,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 5,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Diamonds\"},{\"value\": 2,\"suit\": \"Diamonds\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 12,\"suit\": \"Hearts\"},"+
      "{\"value\": 7,\"suit\": \"Clubs\"},"+
      "{\"value\": 12,\"suit\": \"Spades\"},"+
      "{\"value\": 2,\"suit\": \"Clubs\"},"+
      "{\"value\": 8,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 25,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 9,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Diamonds\"},{\"value\": 11,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 5,\"suit\": \"Clubs\"},{\"value\": 4,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 5,\"suit\": \"Spades\"},"+
      "{\"value\": 6,\"suit\": \"Clubs\"},"+
      "{\"value\": 8,\"suit\": \"Spades\"},"+
      "{\"value\": 10,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 26,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Hearts\"},{\"value\": 6,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Diamonds\"},{\"value\": 4,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Spades\"},{\"value\": 9,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Spades\"},{\"value\": 8,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 3,\"suit\": \"Clubs\"},"+
      "{\"value\": 12,\"suit\": \"Hearts\"},"+
      "{\"value\": 13,\"suit\": \"Clubs\"},"+
      "{\"value\": 11,\"suit\": \"Clubs\"},"+
      "{\"value\": 10,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 27,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Spades\"},{\"value\": 7,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 5,\"suit\": \"Spades\"},{\"value\": 3,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 8,\"suit\": \"Clubs\"},{\"value\": 8,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 5,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 7,\"suit\": \"Clubs\"},"+
      "{\"value\": 7,\"suit\": \"Clubs\"},"+
      "{\"value\": 2,\"suit\": \"Diamonds\"},"+
      "{\"value\": 6,\"suit\": \"Spades\"},"+
      "{\"value\": 11,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":true"+
"},{"+
  "\"id\": 28,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 8,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Clubs\"},{\"value\": 3,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Clubs\"},{\"value\": 2,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Hearts\"},{\"value\": 8,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 13,\"suit\": \"Diamonds\"},"+
      "{\"value\": 7,\"suit\": \"Hearts\"},"+
      "{\"value\": 11,\"suit\": \"Hearts\"},"+
      "{\"value\": 9,\"suit\": \"Hearts\"},"+
      "{\"value\": 3,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":true"+
"},{"+
  "\"id\": 29,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 14,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 5,\"suit\": \"Spades\"},{\"value\": 4,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Hearts\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Spades\"},{\"value\": 6,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 10,\"suit\": \"Diamonds\"},"+
      "{\"value\": 5,\"suit\": \"Clubs\"},"+
      "{\"value\": 5,\"suit\": \"Diamonds\"},"+
      "{\"value\": 12,\"suit\": \"Spades\"},"+
      "{\"value\": 8,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 30,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Spades\"},{\"value\": 4,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Hearts\"},{\"value\": 10,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Spades\"},{\"value\": 14,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 3,\"suit\": \"Spades\"},{\"value\": 2,\"suit\": \"Diamonds\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 7,\"suit\": \"Diamonds\"},"+
      "{\"value\": 4,\"suit\": \"Clubs\"},"+
      "{\"value\": 13,\"suit\": \"Hearts\"},"+
      "{\"value\": 8,\"suit\": \"Diamonds\"},"+
      "{\"value\": 9,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 31,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 8,\"suit\": \"Hearts\"},{\"value\": 7,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Hearts\"},{\"value\": 5,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 9,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Diamonds\"},{\"value\": 13,\"suit\": \"Clubs\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 12,\"suit\": \"Hearts\"},"+
      "{\"value\": 10,\"suit\": \"Hearts\"},"+
      "{\"value\": 4,\"suit\": \"Diamonds\"},"+
      "{\"value\": 7,\"suit\": \"Clubs\"},"+
      "{\"value\": 3,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 32,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Spades\"},{\"value\": 4,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Clubs\"},{\"value\": 6,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 7,\"suit\": \"Spades\"},{\"value\": 7,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Spades\"},{\"value\": 5,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 13,\"suit\": \"Hearts\"},"+
      "{\"value\": 4,\"suit\": \"Diamonds\"},"+
      "{\"value\": 9,\"suit\": \"Clubs\"},"+
      "{\"value\": 11,\"suit\": \"Diamonds\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":true"+
"},{"+
  "\"id\": 33,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 8,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Clubs\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 11,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 5,\"suit\": \"Hearts\"},{\"value\": 4,\"suit\": \"Diamonds\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 12,\"suit\": \"Clubs\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 2,\"suit\": \"Spades\"},"+
      "{\"value\": 8,\"suit\": \"Spades\"},"+
      "{\"value\": 14,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":false"+
"},{"+
  "\"id\": 34,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 3,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Hearts\"},{\"value\": 12,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Spades\"},{\"value\": 8,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 12,\"suit\": \"Diamonds\"},"+
      "{\"value\": 2,\"suit\": \"Hearts\"},"+
      "{\"value\": 10,\"suit\": \"Spades\"},"+
      "{\"value\": 8,\"suit\": \"Hearts\"},"+
      "{\"value\": 14,\"suit\": \"Diamonds\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 35,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Clubs\"},{\"value\": 11,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Hearts\"},{\"value\": 5,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 13,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Hearts\"},{\"value\": 5,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 11,\"suit\": \"Hearts\"},"+
      "{\"value\": 6,\"suit\": \"Clubs\"},"+
      "{\"value\": 7,\"suit\": \"Diamonds\"},"+
      "{\"value\": 3,\"suit\": \"Clubs\"},"+
      "{\"value\": 2,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": false,"+
  "\"win\":true"+
"},{"+
  "\"id\": 36,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Spades\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 8,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 7,\"suit\": \"Diamonds\"},{\"value\": 6,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 5,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 12,\"suit\": \"Clubs\"},"+
      "{\"value\": 5,\"suit\": \"Diamonds\"},"+
      "{\"value\": 9,\"suit\": \"Spades\"},"+
      "{\"value\": 11,\"suit\": \"Diamonds\"},"+
      "{\"value\": 6,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 37,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Spades\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 12,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Hearts\"},{\"value\": 12,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 5,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 5,\"suit\": \"Hearts\"},"+
      "{\"value\": 13,\"suit\": \"Spades\"},"+
      "{\"value\": 10,\"suit\": \"Spades\"},"+
      "{\"value\": 13,\"suit\": \"Hearts\"},"+
      "{\"value\": 2,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 38,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Hearts\"},{\"value\": 6,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Spades\"},{\"value\": 10,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 6,\"suit\": \"Hearts\"},{\"value\": 5,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 8,\"suit\": \"Diamonds\"},{\"value\": 6,\"suit\": \"Spades\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 8,\"suit\": \"Clubs\"},"+
      "{\"value\": 4,\"suit\": \"Spades\"},"+
      "{\"value\": 7,\"suit\": \"Hearts\"},"+
      "{\"value\": 9,\"suit\": \"Diamonds\"},"+
      "{\"value\": 2,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 39,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Clubs\"},{\"value\": 6,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 13,\"suit\": \"Hearts\"},{\"value\": 12,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 10,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Diamonds\"},{\"value\": 6,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 11,\"suit\": \"Spades\"},"+
      "{\"value\": 14,\"suit\": \"Hearts\"},"+
      "{\"value\": 11,\"suit\": \"Diamonds\"},"+
      "{\"value\": 3,\"suit\": \"Diamonds\"},"+
      "{\"value\": 13,\"suit\": \"Spades\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 40,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 11,\"suit\": \"Hearts\"},{\"value\": 10,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 8,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Spades\"},{\"value\": 13,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Clubs\"},{\"value\": 5,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 14,\"suit\": \"Clubs\"},"+
      "{\"value\": 2,\"suit\": \"Hearts\"},"+
      "{\"value\": 13,\"suit\": \"Diamonds\"},"+
      "{\"value\": 11,\"suit\": \"Spades\"},"+
      "{\"value\": 10,\"suit\": \"Hearts\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 41,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Clubs\"},{\"value\": 2,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Hearts\"},{\"value\": 11,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Clubs\"},{\"value\": 7,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Diamonds\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 7,\"suit\": \"Hearts\"},"+
      "{\"value\": 13,\"suit\": \"Diamonds\"},"+
      "{\"value\": 14,\"suit\": \"Hearts\"},"+
      "{\"value\": 8,\"suit\": \"Diamonds\"},"+
      "{\"value\": 6,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 42,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Clubs\"},{\"value\": 12,\"suit\": \"Hearts\"}]}, {"+
      "\"cards\": [{\"value\": 3,\"suit\": \"Spades\"},{\"value\": 3,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 9,\"suit\": \"Hearts\"},{\"value\": 7,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 7,\"suit\": \"Clubs\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 8,\"suit\": \"Diamonds\"},"+
      "{\"value\": 3,\"suit\": \"Clubs\"},"+
      "{\"value\": 7,\"suit\": \"Diamonds\"},"+
      "{\"value\": 5,\"suit\": \"Diamonds\"},"+
      "{\"value\": 9,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":false"+
"},{"+
  "\"id\": 43,"+
  "\"players\": [{"+
      "\"cards\": [{\"value\": 10,\"suit\": \"Diamonds\"},{\"value\": 9,\"suit\": \"Spades\"}]}, {"+
      "\"cards\": [{\"value\": 14,\"suit\": \"Diamonds\"},{\"value\": 3,\"suit\": \"Diamonds\"}]}, {"+
      "\"cards\": [{\"value\": 4,\"suit\": \"Diamonds\"},{\"value\": 4,\"suit\": \"Clubs\"}]}, {"+
      "\"cards\": [{\"value\": 12,\"suit\": \"Diamonds\"},{\"value\": 6,\"suit\": \"Hearts\"}]}],"+
  "\"table\": {"+
    "\"cards\": ["+
      "{\"value\": 8,\"suit\": \"Diamonds\"},"+
      "{\"value\": 9,\"suit\": \"Clubs\"},"+
      "{\"value\": 13,\"suit\": \"Clubs\"},"+
      "{\"value\": 6,\"suit\": \"Spades\"},"+
      "{\"value\": 6,\"suit\": \"Clubs\"}]},"+
  "\"recommendation\": true,"+
  "\"win\":true"+
"}]")
;

class Poker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participantId: "",
      playerData: {
        player: { id: 'player', active: true, hand: [] },
        ai1: { id: 'ai1', active: true, hand: [] },
        ai2: { id: 'ai2', active: true, hand: [] },
        ai3: { id: 'ai3', active: true, hand: [] },
      },
      tableCards: [],
      playerOptions: { Fold: false, Call: false, Deal: true, 'New Game': false },
      displayAICards: false,
      gameStage: 0,
      gameNumber: 0,
      playerIsActive: true,
      resultMessage:0,
      infoMessages: new InfoMessagesQueue(),
    };
  }

  deal = () => {
    const { participantId, gameStage, gameNumber, playerIsActive } = this.state;
    let infoMessages = this.state.infoMessages.copy();
if(gameNumber >= 43){
  return;
}
    const start = Date.now();
    if (gameStage === 0) {
      // deal players cards
      //infoMessages.add('Hole cards dealt.');
      const newPlayerData = clonePlayerData(this.state.playerData);
      // Object.values(newPlayerData).forEach(playerObj => {
      //   playerObj.hand = [deck.dealCard(), deck.dealCard()];
      // });
      //infoMessages.add(JSON.stringify(Object.values(newPlayerData)[0]))
      for(let i = 0; i < 4; i=i+1){
        let player = curatedGame[gameNumber].players[i];
        Object.values(newPlayerData)[i].hand = [
          deck.dealThisCard(player.cards[0].value,player.cards[0].suit),
          deck.dealThisCard(player.cards[1].value,player.cards[1].suit)];
      }
      // this.setState({
      //   playerData: newPlayerData,
      //   playerOptions: {
      //     Deal: false,
      //     Fold: playerIsActive,
      //     Call: playerIsActive,
      //     'New Game': false,
      //   },
      //   //gameStage: gameStage + 1,
      //   infoMessages,
      // });
    // }

    // if (gameStage === 1) {
      // deal the flop
      //infoMessages.add('Flop dealt.');
      //const newTableCards = addToTableCards(this.state.tableCards, 5);
      //infoMessages.add('Game Number: ' + this.state.gameNumber);
      //infoMessages.add(JSON.stringify(curatedGame[this.state.gameNumber]));
      const newTableCards = addTheseCardsToTableCards(this.state.tableCards, curatedGame[gameNumber].table.cards, 5);
      //infoMessages.add(JSON.stringify(newTableCards));
      
    infoMessages.add(participantId);
    infoMessages.add(gameNumber);
    infoMessages.add(start);
    console.log("Recomendation Set. debug");
    console.log(curatedGame[gameNumber].recommendation);
    console.log(curatedGame[gameNumber].recommendation?"You should call":"You should fold");

      this.setState({
        tableCards: newTableCards,
        playerData: newPlayerData,
        playerOptions: {
          Deal: false,
          Fold: playerIsActive,
          Call: playerIsActive,
          'New Game': false,
          Recommendation:curatedGame[gameNumber].recommendation
        },
        //gameStage: gameStage + 1,
        gameStage: gameStage + 4,
        infoMessages,
      });
      console.log(JSON.stringify(this.state.playerOptions.Recommendation));
      console.log("end recommendation set");
    }

    // if (gameStage === 2 || gameStage === 3) {
    //   // deal the turn/river
    //   infoMessages.add(gameStage === 2 ? 'Turn dealt.' : 'River dealt.');
    //   const newTableCards = addToTableCards(this.state.tableCards, 1);
    //   this.setState({
    //     tableCards: newTableCards,
    //     playerOptions: {
    //       Deal: false,
    //       Fold: playerIsActive,
    //       Call: playerIsActive,
    //       'New Game': false,
    //     },
    //     gameStage: gameStage + 1,
    //     infoMessages,
    //   });
    // }

    if (gameStage === 4) {
      let gameResult;
      let displayAICards = true;
      let playerData = this.state.playerData;
      let tableCards = this.state.tableCards;
      gameResult = getWinner(this.state.playerData, this.state.tableCards);
      //infoMessages.add(gameResult.notify);
      // watch for error
      if (!gameResult.error) {
        infoMessages.add(JSON.stringify(gameResult.notify));
        if (gameResult.winners.length < 1) throw new Error('No winners in gameResult!');
        // highlight winning cards
        const highlights = this.getHighlightedWinningCards(gameResult);
        playerData = highlights.playerData;
        tableCards = highlights.tableCards;
        // todo: pot splitting and such
      }
      else{
        infoMessages.add(gameResult.error);
        console.log('error: ', gameResult.error);
      }
      const end = Date.now();
      infoMessages.add(end);
      infoMessages.add(curatedGame[gameNumber].recommendation);
      infoMessages.add(curatedGame[gameNumber].win);
      //infoMessages.add(end - start);
      //infoMessages.add( usedAISuggestion);
      //infoMessages.add(decisionDifficulty);
      console.log("curatedGame[gameNumber].win: " + curatedGame[gameNumber].win);
      console.log("playerData.active: " + playerData.player.active);
      let message = (curatedGame[gameNumber].win && playerData.player.active) ||
      (!curatedGame[gameNumber].win && !playerData.player.active) ? 1 : 2;
      message = message === 2 && curatedGame[gameNumber].win? 3 : message;
      console.log("UI Message: " + message);
      this.setState({
        playerData,
        tableCards,
        displayAICards,
        gameStage: gameStage + 1,
        gameNumber: gameNumber + 1,
        playerOptions: { Fold: false, Call: false, Deal: false, 'New Game': gameNumber <= 43, Recommendation: "" },
        resultMessage: message,
        infoMessages,
      });
      axios.post("http://boston.cs.colostate.edu:8080/upload", {file: participantId+ "-results.csv",data: infoMessages.toArray().join("\t")})
      .then(res => { // then print response status
        console.log(res.statusText)
      })
      //   console.log(fs.appendFileSync.toString());
      //   fs.appendFileSync("t2.log", "wtf\n");
      //   console.log("***************************");
      //   console.log(infoMessages.toArray().join("\n"));
      //   console.log("***************************");
      //   console.log(this.state.infoMessages.toArray().join("\n"));
      //   console.log("***************************");
      //   fs.appendFileSync("TestFile.log",this.state.infoMessages.toArray().join("\n"),"utf-8");
      //   console.log("***************************");
      // try{
      //   this.setState({infoMessages: new InfoMessagesQueue()})
      //   console.log("***************************");
      // }
      // catch(err)
      // {
      //   console.log(err.toString());
      //   //don't clear out the message queue, and try next time
      // }
    }
    if (!playerIsActive && gameStage < 4) setTimeout(this.deal(), 1000);
  };

  getHighlightedWinningCards = gameResult => {
    // create helper object of cards used to pass to shouldHighlight
    const usedCards = new Set();
    gameResult.winners.forEach(scoreObj => {
      scoreObj.cardsUsed.forEach(card => {
        usedCards.add(card.displayName);
      });
    });

    const tableCards = this.state.tableCards.map(card => shouldHighlight(card, usedCards));

    // clone all player data, then run through each winner's hand and highlight cards used
    const playerData = clonePlayerData(this.state.playerData);
    gameResult.winners.forEach(scoreObj => {
      playerData[scoreObj.owner].hand = playerData[scoreObj.owner].hand.map(card =>
        shouldHighlight(card, usedCards)
      );
    });
    return { tableCards, playerData };
  };
setParticipant = event =>{
  this.setState({
    participantId: event.target.value
  });
};

  newGame = () => {
    if(!this.state.participantId){
      console.log("no participant")
    }
    deck.reset();
    console.clear();
    this.setState({
      playerData: {
        player: { id: 'player', active: true, hand: [] },
        ai1: { id: 'ai1', active: true, hand: [] },
        ai2: { id: 'ai2', active: true, hand: [] },
        ai3: { id: 'ai3', active: true, hand: [] },
      },
      tableCards: [],
      playerOptions: { Fold: false, Call: false, Deal: true, 'New Game': false, Recommendation: "" },
      displayAICards: false,
      gameStage: 0,
      playerIsActive: true,
      resultMessage:0,
      infoMessages: new InfoMessagesQueue(),
    },this.deal);
  };

  fold = playerID => {
    const newPlayerData = clonePlayerData(this.state.playerData);
    let AIAction = false;
    if(playerID === "AI"){
AIAction = true;
playerID = "player"
    }
    newPlayerData[playerID].active = false;
    const playerIsActive = playerID === 'player' ? false : this.state.playerIsActive;
    const infoMessages = this.state.infoMessages.copy().add(`${fullNames[playerID]} folds.`);
    infoMessages.add(AIAction);
    this.setState(
      {
        playerData: newPlayerData,
        playerIsActive,
        playerOptions: { Fold: false, Call: false, Deal: false, 'New Game': false, Recommendation: "" },
        infoMessages,
      },
      this.deal
    );
  };

  raise = playerID => {};

  call = playerID => {
    let AIAction = false;
    if(playerID === "AI"){
AIAction = true;
playerID = "player"
    }
    const infoMessages = this.state.infoMessages.copy().add(`${fullNames[playerID]} calls.`);
    infoMessages.add(AIAction);
    this.setState(
      {
        infoMessages,
      },
      this.deal
    );
  };

  render() {
    const {participantId, playerData, tableCards, displayAICards, playerOptions, resultMessage } = this.state;
    return (
      <StyledPoker>
        <div style={{border:"thick solid green",
position: "absolute",
left: "45%",
top: "45%",
background:"darkViolet",
display: resultMessage === 1 ?"block":"none"}}><h2>YOU WIN!</h2></div>
<div style={{border:"thick solid red",
position: "absolute",
left: "45%",
top: "45%",
background:"darkred",
display: resultMessage === 2 ?"block":"none"}}><h2>YOU LOSE!</h2></div>
<div style={{border:"thick solid yellow",
position: "absolute",
left: "45%",
top: "45%",
background:"darkblue",
display: resultMessage === 3 ?"block":"none"}}><h2>YOU WOULD HAVE WON!</h2></div>
        <AI
          data={playerData.ai1}
          tableCards={tableCards}
          key={playerData.ai1.id}
          showCards={displayAICards}
        />
        <AI
          data={playerData.ai2}
          tableCards={tableCards}
          key={playerData.ai2}
          showCards={displayAICards}
        />
        <AI
          data={playerData.ai3}
          tableCards={tableCards}
          key={playerData.ai3.id}
          showCards={displayAICards}
        />
        <Table cards={tableCards} />
        <PlayerDashboard
          data={playerData.player}
          callbacks={{
            Fold: this.fold,
            Call: this.call,
            Deal: this.deal,
            SetParticipant: this.setParticipant,
            'New Game': this.newGame,
            Recommendation: this.state.playerOptions.recommendation
          }}
          participantId={participantId}
          options={playerOptions}
        />
      </StyledPoker>
    );
  }
}

export default Poker;
