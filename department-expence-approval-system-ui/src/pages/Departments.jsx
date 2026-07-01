import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { PageHeader, AppCard, DataTable, SearchBar, AppButton, Pagination } from '../common';
import { DepartmentFormModal } from '../components/departments/DepartmentFormModal';
import { DepartmentDeleteDialog } from '../components/departments/DepartmentDeleteDialog';
import { departmentService } from '../services/departmentService';
import { formatDate } from '../utils/formatters';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering and Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt' | 'departmentName'
  
  // Pagination (Frontend)
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const response = await departmentService.getAllDepartments();
      if (response && response.success && Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    } catch (error) {
      // Error handled by global interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle Search and Sort
  const processedData = useMemo(() => {
    let filtered = departments.filter(d => 
      d.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'departmentName') {
        return a.departmentName.localeCompare(b.departmentName);
      } else {
        // Sort by createdAt desc by default
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [departments, searchQuery, sortBy]);

  // Handle Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedDepartment(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDepartment(dept);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (dept) => {
    setSelectedDepartment(dept);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (selectedDepartment) {
        const res = await departmentService.updateDepartment(selectedDepartment.id, payload);
        if(res.success) toast.success('Department updated successfully');
      } else {
        const res = await departmentService.createDepartment(payload);
        if(res.success) toast.success('Department created successfully');
      }
      setIsFormModalOpen(false);
      fetchDepartments();
    } catch (error) {
      // Error toast already fired from axios interceptor
      throw error; // To keep isSubmitting true if needed or to handle locally
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await departmentService.deleteDepartment(selectedDepartment.id);
      if(res.success) toast.success('Department deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchDepartments();
    } catch (error) {
       // Interceptor handles the specific messages (e.g. 400 Bad Request if budgets/claims exist)
       throw error;
    }
  };

  const columns = [
    {
      header: 'S.No',
      accessor: 'sno',
      render: (row) => processedData.indexOf(row) + 1
    },
    {
      header: 'Department Name',
      accessor: 'departmentName'
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Updated At',
      accessor: 'updatedAt',
      render: (row) => formatDate(row.updatedAt)
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-primary" 
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(row); }}
            title="Edit"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button 
            className="btn btn-sm btn-outline-danger" 
            onClick={(e) => { e.stopPropagation(); handleOpenDelete(row); }}
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Departments" 
        subtitle="Manage company departments" 
        action={
          <AppButton icon="bi-plus-lg" onClick={handleOpenCreate}>
            Create Department
          </AppButton>
        }
      />
      
      <AppCard>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4 gap-3">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <SearchBar 
              placeholder="Search departments..." 
              value={searchQuery} 
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(0); // Reset to first page on search
              }} 
            />
          </div>
          <div>
            <select 
              className="form-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Sort by Date (Newest)</option>
              <option value="departmentName">Sort by Name (A-Z)</option>
            </select>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={paginatedData} 
          isLoading={isLoading} 
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </AppCard>

      {/* Modals */}
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
