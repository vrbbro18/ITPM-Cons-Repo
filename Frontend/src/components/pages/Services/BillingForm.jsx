import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InvoiceDownloadButton from './Invoice'
import './BillingForm.css'

export default function BillingForm() {
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    estimateTime: '',
    startDate: '',
    endDate: '',
    email: '',
    address: '',
    phoneNo1: '',
    phoneNo2: '',
    materials: [],
    currentMaterial: {
      name: '',
      quantity: '',
      unit: 'KG',
      price: '1000'
    }
  })

  const [errors, setErrors] = useState({
    startDate: '',
    endDate: '',
    email: '',
    phoneNo1: '',
    phoneNo2: ''
  })

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const [editingMaterial, setEditingMaterial] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const validateStartDate = (date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return 'Start date cannot be in the past'
    }
    return ''
  }

  const validateEndDate = (date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return 'End date cannot be in the past'
    }
    return ''
  }

  const validateEmail = (email) => {
    if (!email) return 'Email is required'
    if (!email.includes('@')) {
      return 'The "@" symbol is missing in the email provided'
    }
    return ''
  }

  const validatePhone = (phone, fieldName) => {
    if (!phone) return `${fieldName} is required`
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return 'Phone number must be 10 digits'
    }
    return ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate fields on change
    switch (name) {
      case 'startDate':
        setErrors(prev => ({ ...prev, startDate: validateStartDate(value) }))
        break
      case 'endDate':
        setErrors(prev => ({ ...prev, endDate: validateEndDate(value) }))
        break
      case 'email':
        setErrors(prev => ({ ...prev, email: validateEmail(value) }))
        break
      case 'phoneNo1':
        setErrors(prev => ({ ...prev, phoneNo1: validatePhone(value, 'Phone number 1') }))
        break
      case 'phoneNo2':
        setErrors(prev => ({ ...prev, phoneNo2: validatePhone(value, 'Phone number 2') }))
        break
    }
  }

  const handleMaterialChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      currentMaterial: {
        ...prev.currentMaterial,
        [name]: value
      }
    }))
  }

  const addMaterial = () => {
    const { name, quantity, unit } = formData.currentMaterial
    
    // Validate required fields
    if (!name || !quantity) {
      return
    }

    const newMaterial = {
      id: String(formData.materials.length + 1).padStart(2, '0'),
      name,
      quantity,
      unit,
      price: '1000'  // Fixed price at 1000 LKR
    }

    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
      currentMaterial: {
        name: '',
        quantity: '',
        unit: 'KG',
        price: '1000'  // Reset with default price
      }
    }))
  }

  const handleDeleteMaterial = (id) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(material => material.id !== id)
    }))
  }

  const handleEditClick = (material) => {
    setEditingMaterial({ ...material })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingMaterial) return

    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map(material => 
        material.id === editingMaterial.id ? editingMaterial : material
      )
    }))
    setShowEditModal(false)
    setEditingMaterial(null)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditingMaterial(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const errors = {}
    
    // Validate Project Details
    if (!formData.projectName) errors.projectName = 'Project name is required'
    if (!formData.location) errors.location = 'Location is required'
    if (!formData.estimateTime) errors.estimateTime = 'Estimate time is required'
    if (!formData.startDate) errors.startDate = 'Start date is required'
    if (!formData.endDate) errors.endDate = 'End date is required'
    
    // Validate Contact Details
    if (!formData.email) errors.email = 'Email is required'
    if (!formData.address) errors.address = 'Address is required'
    if (!formData.phoneNo1) errors.phoneNo1 = 'Phone number 1 is required'
    
    // Validate Materials
    if (formData.materials.length === 0) errors.materials = 'At least one material is required'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000) // Hide message after 3 seconds
    }
  }

  return (
    <div className="billing-container">
      {/* Page Title */}
      <div className="page-title">
        <h1>Construction Billing</h1>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Edit Material</h3>
            <div className="form-grid">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <select
                  name="name"
                  value={editingMaterial.name}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                >
                  <option value="Brick">Brick</option>
                  <option value="Cement">Cement</option>
                  <option value="Sand">Sand</option>
                  <option value="Steel">Steel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="quantity"
                    value={editingMaterial.quantity}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                  <select
                    name="unit"
                    value={editingMaterial.unit}
                    onChange={handleEditFormChange}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    <option value="KG">KG</option>
                    <option value="Units">Units</option>
                    <option value="Tons">Tons</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleSaveEdit} className="update-button">
                Save Changes
              </button>
              <button onClick={() => {
                setShowEditModal(false)
                setEditingMaterial(null)
              }} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Popup */}
      {showSuccessMessage && (
        <div className="success-message">
          <div className="success-message-content">
            <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-800 font-medium">Bill Submitted Successfully</span>
          </div>
        </div>
      )}

      <div className="main-content">
        {/* Main Content (Left Side) */}
        <div className="left-section">
          {/* Project Details Section */}
          <div className="section-card">
            <h2 className="section-title">Project Details</h2>
            <div className="form-grid">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.projectName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {formErrors.projectName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.projectName}</p>
                )}
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                )}
              </div>
              <div>
                <label htmlFor="estimateTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Estimate Time
                </label>
                <input
                  type="text"
                  id="estimateTime"
                  name="estimateTime"
                  value={formData.estimateTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.estimateTime ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {formErrors.estimateTime && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.estimateTime}</p>
                )}
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="section-card">
            <h2 className="section-title">Contact Details</h2>
            <div className="form-grid">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>
              <div>
                <label htmlFor="phoneNo1" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone No 1
                </label>
                <input
                  type="tel"
                  id="phoneNo1"
                  name="phoneNo1"
                  value={formData.phoneNo1}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.phoneNo1 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.phoneNo1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNo1}</p>
                )}
              </div>
              <div>
                <label htmlFor="phoneNo2" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone No 2
                </label>
                <input
                  type="tel"
                  id="phoneNo2"
                  name="phoneNo2"
                  value={formData.phoneNo2}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.phoneNo2 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.phoneNo2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNo2}</p>
                )}
              </div>
            </div>
          </div>

          {/* Materials and Costs Section */}
          <div className="section-card">
            <h2 className="section-title">Materials and Costs</h2>
            <div className="materials-grid">
              <div className="col-span-4 relative">
                <label htmlFor="materialName" className="block text-sm font-medium text-gray-700 mb-1">
                  Choose materials
                </label>
                <select
                  id="materialName"
                  name="name"
                  value={formData.currentMaterial.name}
                  onChange={handleMaterialChange}
                  className={`w-full px-3 py-2 border ${formErrors.materials ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white appearance-none`}
                >
                  <option value="">Select material</option>
                  <option value="Brick">Brick</option>
                  <option value="Cement">Cement</option>
                  <option value="Sand">Sand</option>
                  <option value="Steel">Steel</option>
                </select>
                {formErrors.materials && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.materials}</p>
                )}
              </div>
              <div className="col-span-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.currentMaterial.quantity}
                    onChange={handleMaterialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                  <select
                    name="unit"
                    value={formData.currentMaterial.unit}
                    onChange={handleMaterialChange}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white"
                  >
                    <option value="KG">KG</option>
                    <option value="Units">Units</option>
                    <option value="Tons">Tons</option>
                  </select>
                </div>
              </div>
              <div className="col-span-4">
                <button
                  onClick={addMaterial}
                  className="add-button"
                  disabled={!formData.currentMaterial.name || !formData.currentMaterial.quantity}
                >
                  Add Materials
                </button>
              </div>
            </div>

            {/* Materials Table */}
            <div className="materials-table">
              <table className="min-w-full">
                <thead className="table-header">
                  <tr className="bg-pink-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Material No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Price Per Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {formData.materials.map((material) => (
                    <tr key={material.id} className="hover:bg-pink-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        #{material.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {material.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {material.quantity} {material.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {material.price} LKR
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {Number(material.quantity) * Number(material.price)} LKR
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="Edit item"
                          onClick={() => handleEditClick(material)}
                        >
                          <EditIcon style={{ fontSize: 20, color: '#4B5563' }} />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="Delete item"
                          onClick={() => handleDeleteMaterial(material.id)}
                        >
                          <DeleteIcon style={{ fontSize: 20, color: '#4B5563' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quotation Details Section (Right Side) */}
        <div className="quotation-section">
          <div className="quotation-card">
            <h2 className="quotation-title">Quotation Details</h2>
            <div className="quotation-items">
              {formData.materials.map((material) => (
                <div key={material.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {material.name} {material.quantity}x{material.price}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {Number(material.quantity) * Number(material.price)} LKR
                  </span>
                </div>
              ))}
            </div>
            <div className="quotation-total">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-medium text-gray-900">
                  {formData.materials.reduce((total, material) => 
                    total + (Number(material.quantity) * Number(material.price)), 0)
                  } LKR
                </span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <InvoiceDownloadButton formData={formData} />
              <button onClick={handleSubmit} className="add-button">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 