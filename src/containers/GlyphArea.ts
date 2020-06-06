import { Action } from 'typescript-fsa';
import { connect } from 'react-redux';
import { editorActions, CTMInv } from '../actions/editor';
import GlyphArea from '../components/GlyphArea';
import { AppState } from '../reducers';
import { Dispatch } from 'redux';

export interface GlyphAreaActions {
  selectSingle: (index: number) => Action<number>;
  selectXorSingle: (index: number) => Action<number>;
  selectNone: () => Action<void>;
  updateCTMInv: (ctm: CTMInv) => Action<CTMInv>;
  startAreaSelect: (evt: React.MouseEvent) => Action<React.MouseEvent>;
  startSelectionDrag: (evt: React.MouseEvent) => Action<React.MouseEvent>;
  handleMouseMove: (evt: MouseEvent) => Action<MouseEvent>;
  handleMouseUp: (evt: MouseEvent) => Action<MouseEvent>;
}

const mapStateToProps = (state: AppState) => ({ ...state.editor });

const mapDispatchToProps = (dispatch: Dispatch<Action<unknown>>) => ({
  selectSingle: (index: number) => dispatch(editorActions.selectSingle(index)),
  selectXorSingle: (index: number) => dispatch(editorActions.selectXorSingle(index)),
  selectNone: () => dispatch(editorActions.selectNone()),
  updateCTMInv: (ctminv: CTMInv) => dispatch(editorActions.updateCTMInv(ctminv)),
  startAreaSelect: (evt: React.MouseEvent) => dispatch(editorActions.startAreaSelect(evt)),
  startSelectionDrag: (evt: React.MouseEvent) => dispatch(editorActions.startSelectionDrag(evt)),
  handleMouseMove: (evt: MouseEvent) => dispatch(editorActions.mouseMove(evt)),
  handleMouseUp: (evt: MouseEvent) => dispatch(editorActions.mouseUp(evt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlyphArea);
