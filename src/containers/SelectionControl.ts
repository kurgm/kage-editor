import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createSelector } from 'reselect';

import { editorActions, RectPointPosition } from '../actions/editor';
import SelectionControl from '../components/SelectionControl';
import { AppState } from '../reducers';
import { getGlyphLinesBBX, Glyph } from '../kageUtils';

export interface RectControl {
  multiSelect: boolean;
  coords: [number, number, number, number];
}
export interface ControlPoint {
  x: number;
  y: number;
  className: string;
}

export interface SelectionControlState {
  rectControl: RectControl | null;
  pointControl: ControlPoint[];
}

export interface SelectionControlActions {
  handleMouseDownRectControl: (evt: React.MouseEvent, position: RectPointPosition) => void;
  handleMouseDownPointControl: (evt: React.MouseEvent, pointIndex: number) => void;
}

const mapStateToProps = createSelector(
  [
    (state: AppState) => state.editor.glyph,
    (state: AppState) => state.editor.selection,
  ],
  (glyph: Glyph, selection: number[]): SelectionControlState => {
    if (selection.length === 0) {
      return { rectControl: null, pointControl: [] };
    }
    if (selection.length > 1) {
      const selectedStrokes = selection.map((index) => glyph[index]);
      const bbx = getGlyphLinesBBX(selectedStrokes);
      return {
        rectControl: {
          multiSelect: true,
          coords: bbx,
        },
        pointControl: [],
      };
    }
    const selectedStroke = glyph[selection[0]];
    switch (selectedStroke.value[0]) {
      case 0:
      case 9:
      case 99:
        return {
          rectControl: {
            multiSelect: false,
            coords: [
              selectedStroke.value[3],
              selectedStroke.value[4],
              selectedStroke.value[5],
              selectedStroke.value[6],
            ],
          },
          pointControl: [],
        };
      case 1:
      case 2:
      case 3:
      case 4:
      case 6:
      case 7: {
        const pointControl: ControlPoint[] = [];
        for (let i = 3; i + 2 <= selectedStroke.value.length; i += 2) {
          pointControl.push({
            x: selectedStroke.value[i],
            y: selectedStroke.value[i + 1],
            className: '', // FIXME: match detection
          });
        }
        return { rectControl: null, pointControl };
      }
      default:
        return { rectControl: null, pointControl: [] };
    }
  }
);

const mapDispatchToProps = (dispatch: Dispatch): SelectionControlActions => ({
  handleMouseDownRectControl: (evt: React.MouseEvent, position: RectPointPosition) => {
    dispatch(editorActions.startResize([evt, position]));
    evt.stopPropagation();
  },
  handleMouseDownPointControl: (evt: React.MouseEvent, pointIndex: number) => {
    dispatch(editorActions.startPointDrag([evt, pointIndex]));
    evt.stopPropagation();
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(SelectionControl);
