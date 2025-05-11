import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer'
import { useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import './Invoice.css'

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000000',
    margin: 10
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a1a1a',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666666'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 5
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: '30%',
    fontSize: 12,
    color: '#666666'
  },
  value: {
    width: '70%',
    fontSize: 12,
    color: '#333333'
  },
  table: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  col1: { width: '15%' },
  col2: { width: '25%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  col5: { width: '20%' },
  total: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 8
  },
  thankYouSection: {
    marginTop: 50,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  thankYouText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4B5563',
    fontStyle: 'italic'
  }
})

// PDF Document component
const InvoicePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>BuildEase Invoice</Text>
      <Text style={styles.subtitle}>Construction Material Billing System</Text>

      {/* Project Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Project Name:</Text>
          <Text style={styles.value}>{data.projectName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{data.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimate Time:</Text>
          <Text style={styles.value}>{data.estimateTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>{data.startDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.value}>{data.endDate}</Text>
        </View>
      </View>

      {/* Contact Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone No 1:</Text>
          <Text style={styles.value}>{data.phoneNo1}</Text>
        </View>
        {data.phoneNo2 && (
          <View style={styles.row}>
            <Text style={styles.label}>Phone No 2:</Text>
            <Text style={styles.value}>{data.phoneNo2}</Text>
          </View>
        )}
      </View>

      {/* Materials Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materials and Costs</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Material No</Text>
            <Text style={styles.col2}>Material</Text>
            <Text style={styles.col3}>Quantity</Text>
            <Text style={styles.col4}>Price/Unit</Text>
            <Text style={styles.col5}>Total</Text>
          </View>
          {data.materials.map((material) => (
            <View key={material.id} style={styles.tableRow}>
              <Text style={styles.col1}>#{material.id}</Text>
              <Text style={styles.col2}>{material.name}</Text>
              <Text style={styles.col3}>{material.quantity} {material.unit}</Text>
              <Text style={styles.col4}>{material.price} LKR</Text>
              <Text style={styles.col5}>
                {Number(material.quantity) * Number(material.price)} LKR
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.total}>
          <Text>
            Total Amount: {data.materials.reduce((sum, material) => 
              sum + (Number(material.quantity) * Number(material.price)), 0
            )} LKR
          </Text>
        </View>
      </View>

      {/* Thank You Message */}
      <View style={styles.thankYouSection}>
        <Text style={styles.thankYouText}>
          Thanks For Using BuildEase
        </Text>
      </View>
    </Page>
  </Document>
)

// Invoice Download Button Component
const InvoiceDownloadButton = ({ formData }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      const blob = await pdf(<InvoicePDF data={formData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'BuildEase-Invoice.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button 
      onClick={handleDownload}
      className="invoice-button"
    >
      <DownloadIcon className="invoice-icon" />
      <span className="invoice-text">Download PDF</span>
    </button>
  )
}

export default InvoiceDownloadButton 