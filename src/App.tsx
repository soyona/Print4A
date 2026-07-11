import { PreviewContainer } from './components/PreviewContainer.js';
import { SidebarLayout } from './components/SidebarLayout.js';

export const App = () => (
  <div className="flex min-h-screen bg-slate-100 text-slate-950">
    <SidebarLayout />
    <PreviewContainer />
  </div>
);

export default App;
