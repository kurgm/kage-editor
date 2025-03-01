import { useHotkeys } from 'react-hotkeys-hook';

import { useAppDispatch } from './hooks';
import { selectActions } from './actions/select';
import { editorActions } from './actions/editor';
import { undoActions } from './actions/undo';

export const useShortcuts = () => {
  const dispatch = useAppDispatch();
  useHotkeys('mod+a', (evt) => {
    dispatch(selectActions.selectAll());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('mod+i', (evt) => {
    dispatch(selectActions.selectDeselected());
    evt.preventDefault();
  }, {}, [dispatch]);

  useHotkeys('mod+z', (evt) => {
    dispatch(undoActions.undo());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('mod+y, mod+shift+z', (evt) => {
    dispatch(undoActions.redo());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('mod+x', (evt) => {
    dispatch(editorActions.cut());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('mod+c', (evt) => {
    dispatch(editorActions.copy());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('mod+v', (evt) => {
    dispatch(editorActions.paste());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('del', (evt) => {
    dispatch(editorActions.delete());
    evt.preventDefault();
  }, {}, [dispatch]);

  useHotkeys('esc', () => {
    dispatch(editorActions.escape());
  }, {}, [dispatch]);

  useHotkeys('ctrl+h, left', (evt) => {
    dispatch(editorActions.moveSelected([-1, 0]));
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+j, down', (evt) => {
    dispatch(editorActions.moveSelected([0, 1]));
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+k, up', (evt) => {
    dispatch(editorActions.moveSelected([0, -1]));
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+l, right', (evt) => {
    dispatch(editorActions.moveSelected([1, 0]));
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+shift+h, shift+left', (evt) => {
    dispatch(editorActions.moveSelected([-5, 0]));
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+shift+j, shift+down', (evt) => {
    dispatch(editorActions.moveSelected([0, 5]));
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+shift+k, shift+up', (evt) => {
    dispatch(editorActions.moveSelected([0, -5]));
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+shift+l, shift+right', (evt) => {
    dispatch(editorActions.moveSelected([5, 0]));
    evt.preventDefault();
  }, {}, [dispatch]);

  useHotkeys('mod+s', (evt) => {
    dispatch(editorActions.finishEdit(evt));
    evt.preventDefault();
  }, {}, [dispatch]);
};
