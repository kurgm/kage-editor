import { useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

import { selectActions } from './actions/select';
import { editorActions } from './actions/editor';
import { undoActions } from './actions/undo';

export const useShortcuts = () => {
  const dispatch = useDispatch();
  useHotkeys('ctrl+a, command+a', (evt) => {
    dispatch(selectActions.selectAll());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+i, command+i', (evt) => {
    dispatch(selectActions.selectDeselected());
    evt.preventDefault();
  }, {}, [dispatch]);

  useHotkeys('ctrl+z, command+z', (evt) => {
    dispatch(undoActions.undo());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+y, command+y, ctrl+shift+z, command+shift+z', (evt) => {
    dispatch(undoActions.redo());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+x, command+x', (evt) => {
    dispatch(editorActions.cut());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+c, command+c', (evt) => {
    dispatch(editorActions.copy());
    evt.preventDefault();
  }, {}, [dispatch]);
  useHotkeys('ctrl+v, command+v', (evt) => {
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

  useHotkeys('ctrl+s, command+s', (evt) => {
    dispatch(editorActions.finishEdit(evt));
    evt.preventDefault();
  }, {}, [dispatch]);
};
