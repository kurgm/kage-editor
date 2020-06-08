import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// import { editorActions } from '../actions/editor';
import EditorControls from '../components/EditorControls';
import { AppState } from '../reducers';

export interface EditorControlsActions {
};

const mapStateToProps = (state: AppState) => state.editor;

const mapDispatchToProps = (dispatch: Dispatch): EditorControlsActions => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorControls);
