import React from 'react';
import PlayerHand from '../components/PlayerHand';
import OptionsPanel from '../components/OptionsPanel';
import styled from 'styled-components';
import Balance from './Balance';

const StyledPlayerDashboard = styled.div`
  grid-area: player;
  align-self: center;
  height: 92%;
  width: 100%;
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-areas: 'playerName playerCards playerOptions';
  #status-wrapper {
    font-family: Courgette;
    padding: 10px 20px;
    h4 {
      text-align: left;
      grid-area: playerName;
    }
  }
  h4 {
    margin: 0 auto;
  }
`;

const PlayerDashboard = ({ data, options, callbacks }) => {
  return (
    <StyledPlayerDashboard>
      <div id="status-wrapper">
        <h4>{`Player${data.active ? '' : ' (folded)'}`}</h4>
        <Balance area="player" amount={data.balance} />
      </div>
      <PlayerHand hand={data.hand} />
      <OptionsPanel options={options} callbacks={callbacks} />
    </StyledPlayerDashboard>
  );
};

export default PlayerDashboard;
