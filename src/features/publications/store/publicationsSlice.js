import { createSlice } from '@reduxjs/toolkit'

const MOCK_PUBLICATIONS = [
  { id: 1, name: 'مطور Full Stack 2026', description: 'دورة شاملة لتعلم تطوير الواجهات والخوادم', obeyStartDate: true, customersCount: 45, docsCount: 12, status: 'active', createdAt: '2026-01-15' },
  { id: 2, name: 'Python للذكاء الاصطناعي', description: 'تعلم Python مع تطبيقات الذكاء الاصطناعي', obeyStartDate: false, customersCount: 120, docsCount: 8, status: 'active', createdAt: '2026-02-01' },
  { id: 3, name: 'تصميم واجهات المستخدم', description: 'أساسيات ومبادئ تصميم UI/UX', obeyStartDate: true, customersCount: 67, docsCount: 15, status: 'active', createdAt: '2025-12-20' },
  { id: 4, name: 'أمن المعلومات المتقدم', description: 'حماية الشبكات والأنظمة من الاختراق', obeyStartDate: false, customersCount: 23, docsCount: 6, status: 'active', createdAt: '2026-03-01' },
  { id: 5, name: 'Laravel للمحترفين', description: 'بناء تطبيقات ويب متقدمة مع Laravel', obeyStartDate: true, customersCount: 89, docsCount: 20, status: 'active', createdAt: '2025-11-10' },
  { id: 6, name: 'React Native للهواتف', description: 'تطوير تطبيقات الهاتف باستخدام React Native', obeyStartDate: false, customersCount: 34, docsCount: 10, status: 'active', createdAt: '2026-02-20' },
  { id: 7, name: 'DevOps و Docker', description: 'إدارة الخوادم والنشر المستمر', obeyStartDate: true, customersCount: 15, docsCount: 5, status: 'active', createdAt: '2026-03-15' },
  { id: 8, name: 'قواعد البيانات المتقدمة', description: 'PostgreSQL و MongoDB و تحسين الأداء', obeyStartDate: false, customersCount: 56, docsCount: 9, status: 'active', createdAt: '2025-10-05' },
]

const publicationsSlice = createSlice({
  name: 'publications',
  initialState: {
    list: MOCK_PUBLICATIONS,
    selectedPublication: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPublications: (state, action) => {
      state.list = action.payload
    },
    addPublication: (state, action) => {
      state.list.unshift(action.payload)
    },
    updatePublication: (state, action) => {
      const idx = state.list.findIndex(p => p.id === action.payload.id)
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
    },
    deletePublication: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload)
    },
    deleteMultiplePublications: (state, action) => {
      state.list = state.list.filter(p => !action.payload.includes(p.id))
    },
    setSelectedPublication: (state, action) => {
      state.selectedPublication = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setPublications,
  addPublication,
  updatePublication,
  deletePublication,
  deleteMultiplePublications,
  setSelectedPublication,
  setLoading,
  setError,
} = publicationsSlice.actions

export default publicationsSlice.reducer
