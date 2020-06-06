import { Action } from 'typescript-fsa';
import { connect } from 'react-redux';
import { editorActions } from '../actions/editor';
import GlyphArea from '../components/GlyphArea';
import { AppState } from '../reducers';
import { Dispatch } from 'redux';

export interface GlyphAreaActions {
  selectSingle: (index: number) => Action<number>;
}

const mapStateToProps = (state: AppState) => ({ ...state.editor });

const mapDispatchToProps = (dispatch: Dispatch<Action<number>>) => ({
  selectSingle: (index: number) => dispatch(editorActions.selectSingle(index))
})

export default connect(mapStateToProps, mapDispatchToProps)(GlyphArea);
