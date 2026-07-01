import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { PageHeader, AppCard, DataTable, SearchBar, AppButton, Pagination } from '../common';
import { DepartmentFormModal } from '../components/departments/DepartmentFormModal';
import { DepartmentDeleteDialog } from '../components/departments/DepartmentDeleteDialog';
import { departmentService } from '../services/departmentService';
import { formatDate } from '../utils/formatters';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy]           = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [isFormModalOpen, setIsFormModalOpen]     = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const response = await departmentService.getAllDepartments();
      if (response?.success && Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    } catch (error) {
      // Handled globally
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const processedData = useMemo(() => {
    let filtered = departments.filter(d =>
      d.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered.sort((a, b) =>
      sortBy === 'departmentName'
        ? a.departmentName.localeCompare(b.departmentName)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    return filtered;
  }, [departments, searchQuery, sortBy]);

  const totalPages   = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage]);

  const handleOpenCreate = () => { setSelectedDepartment(null); setIsFormModalOpen(true); };
  const handleOpenEdit   = (dept) => { setSelectedDepartment(dept); setIsFormModalOpen(true); };
  const handleOpenDelete = (dept) => { setSelectedDepartment(dept); setIsDeleteDialogOpen(true); };

  const handleFormSubmit = async (payload) => {
    try {
      if (selectedDepartment) {
        const res = await departmentService.updateDepartment(selectedDepartment.id, payload);
        if (res.success) toast.success('Department updated successfully');
      } else {
        const res = await departmentService.createDepartment(payload);
        if (res.success) toast.success('Department created successfully');
      }
      setIsFormModalOpen(false);
      fetchDepartments();
    } catch (error) { throw error; }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await departmentService.deleteDepartment(selectedDepartment.id);
      if (res.success) toast.success('Department deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchDepartments();
    } catch (error) { throw error; }
  };

  const columns = [
    {
      header: '#',
      accessor: 'sno',
      render: (_row, _col, rowIndex) => currentPage * pageSize + rowIndex + 1,
    },
    { header: 'Department Name', accessor: 'departmentName' },
    { header: 'Created', accessor: 'createdAt', render: (row) => formatDate(row.createdAt) },
    { header: 'Updated', accessor: 'updatedAt', render: (row) => formatDate(row.updatedAt) },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(row); }}
            aria-label={`Edit department: ${row.departmentName}`}
            title="Edit"
          >
            <i className="bi bi-pencil-square" aria-hidden="true" />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={(e) => { e.stopPropagation(); handleOpenDelete(row); }}
            aria-label={`Delete department: ${row.departmentName}`}
            title="Delete"
          >
            <i className="bi bi-trash3" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  // Fix render signature: pass rowIndex
  const tableData = paginatedData.map((row, i) => ({ ...row, _rowIndex: i }));
  const fixedColumns = columns.map(col => col.accessor === 'sno'
    ? { ...col, render: (row) => currentPage * pageSize + paginatedData.indexOf(row) + 1 }
    : col
  );

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Manage company departments"
        action={
          <AppButton icon="bi-plus-lg" onClick={handleOpenCreate}>Create Department</AppButton>
        }
      />

      <AppCard>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4 gap-3 align-items-md-center">
          <div style={{ maxWidth: 340, flex: 1 }}>
            <SearchBar
              placeholder="Search departments…"
              value={searchQuery}
              onChange={(val) => { setSearchQuery(val); setCurrentPage(0); }}
            />
          </div>
          <div className="d-flex gap-2 align-items-center">
            <label htmlFor="dept-sort" className="text-muted" style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>Sort by</label>
            <select
              id="dept-sort"
              className="form-select form-select-sm"
              style={{ minWidth: 160 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date (Newest)</option>
              <option value="departmentName">Name (A–Z)</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={fixedColumns}
          data={paginatedData}
          isLoading={isLoading}
          totalCount={processedData.length}
          currentPage={currentPage}
          pageSize={pageSize}
          emptyTitle="No Departments Found"
          emptyMessage={searchQuery ? `No departments match "${searchQuery}"` : 'Create your first department to get started.'}
          emptyAction={
            !searchQuery && (
              <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
                <i className="bi bi-plus-lg me-1" /> Create Department
              </button>
            )
          }
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </AppCard>

      {isFormModalOpen && (
        <DepartmentFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          defaultValues={selectedDepartment ? { departmentName: selectedDepartment.departmentName } : null}
        />
      )}
      {isDeleteDialogOpen && (
        <DepartmentDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          departmentName={selectedDepartment?.departmentName}
        />
      )}
    </div>
  );
};
