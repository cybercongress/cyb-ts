import { Routes, Route } from 'react-router-dom';
import { routes } from 'src/routes';
import { MainContainer } from 'src/components';
import Governance from './governance';
import ProposalsDetail from './proposalsDetail';
import CreateProposal from './CreateProposal/CreateProposal';

// FIXME: replace(routes.senate.path, '/')
function GovernanceRoutes() {
  return (
    <MainContainer>
      <Routes>
        <Route
          path={routes.senate.path.replace(routes.senate.path, '/')}
          element={<Governance />}
        />
        <Route
          path={routes.senate.routes.proposal.path.replace(
            routes.senate.path,
            '/'
          )}
          element={<ProposalsDetail />}
        />

        <Route
          path={routes.senate.routes.new.path.replace(routes.senate.path, '/')}
          element={<CreateProposal />}
        />
      </Routes>
    </MainContainer>
  );
}

export default GovernanceRoutes;
