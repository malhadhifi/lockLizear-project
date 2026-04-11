import { useState } from 'react'

const PublicationFilters = ({ search, onSearchChange, sortBy, onSortChange, filterObey, onFilterObeyChange }) => {
  return (
    <div className="card-header flex-wrap gap-3">
      <div className="d-flex gap-2 flex-wrap align-items-center">
        {/* البحث */}
        <div className="drm-search" style={{ width: '260px' }}>
          <i className="bi bi-search" />
          <input
            type="text"
            className="form-control"
            placeholder="البحث بالاسم أو الوصف..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        {/* الفرز */}
        <select
          className="form-select drm-input"
          style={{ width: '160px' }}
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
        >
          <option value="name">الفرز بالاسم</option>
          <option value="id">الفرز بالـ ID</option>
          <option value="createdAt">الفرز بالتاريخ</option>
          <option value="customersCount">الفرز بالعملاء</option>
          <option value="docsCount">الفرز بالمستندات</option>
        </select>

        {/* فلتر Obey */}
        <select
          className="form-select drm-input"
          style={{ width: '180px' }}
          value={filterObey}
          onChange={e => onFilterObeyChange(e.target.value)}
        >
          <option value="all">جميع المنشورات</option>
          <option value="obey">تلتزم بتاريخ البدء</option>
          <option value="no-obey">لا تلتزم بتاريخ البدء</option>
        </select>
      </div>
    </div>
  )
}

export default PublicationFilters
