import React from 'react';
import PlayerHand from '../components/PlayerHand';
import OptionsPanel from '../components/OptionsPanel';
import styled from 'styled-components';

const StyledPlayerDashboard = styled.div`
  grid-area: player;
  display: grid;
  grid-template-columns: 10% 50% 40%;
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

const PlayerDashboard = ({participantId, data, options, callbacks, Recommendation }) => {
  return (
    <StyledPlayerDashboard>
      <div id="status-wrapper">
        <h4>{`Player${data.active ? '' : ' (folded)'}`}</h4>
      </div>
      <PlayerHand hand={data.hand} />
      <OptionsPanel participantId={participantId} options={options} callbacks={callbacks} Recommendation={Recommendation} />
    </StyledPlayerDashboard>
  );
};

export default PlayerDashboard;
