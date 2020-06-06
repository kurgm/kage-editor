import { Action } from 'typescript-fsa';
import { connect } from 'react-redux';
import { editorActions } from '../actions/editor';
import GlyphArea from '../components/GlyphArea';
import { AppState } from '../reducers';
import { Dispatch } from 'redux';

export interface GlyphAreaActions {
  selectSingle: (index: number) => Action<number>;
  selectXorSingle: (index: number) => Action<number>;
}

const mapStateToProps = (state: AppState) => ({ ...state.editor });

const mapDispatchToProps = (dispatch: Dispatch<Action<unknown>>) => ({
  selectSingle: (index: number) => dispatch(editorActions.selectSingle(index)),
  selectXorSingle: (index: number) => dispatch(editorActions.selectXorSingle(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlyphArea);
