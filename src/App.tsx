import GlyphArea from './components/GlyphArea';
import EditorControls from './components/EditorControls';
import PartsSearch from './components/PartsSearch'
import SubmitForm from './components/SubmitForm';
import OptionModal from './components/OptionModal';

import { useShortcuts } from './shortcuts';

import './App.css';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  useShortcuts();
  return (
    <div className="App" lang={i18n.language}>
      <GlyphArea />
      <EditorControls />
      <PartsSearch />
      <SubmitForm />
      <OptionModal />
    </div>
  );
}

export default App;
