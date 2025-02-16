import { useDispatch, useSelector } from 'react-redux'
import type { AppState } from './reducers'
import type { AppDispatch } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<AppState>()
