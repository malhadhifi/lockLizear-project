import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [], selectedUser: null,
    loading: false, error: null,
    pagination: { page:1, perPage:20, total:0 }
  },
  reducers: {
    setUsers: (s,a)    => { s.list=a.payload },
    setLoading: (s,a)  => { s.loading=a.payload },
    setError: (s,a)    => { s.error=a.payload },
    setSelected: (s,a) => { s.selectedUser=a.payload },
  }
})

export const { setUsers, setLoading, setError, setSelected } = usersSlice.actions
export default usersSlice.reducer
