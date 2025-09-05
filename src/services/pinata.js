import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS } from '../config/api.js'

export class PinataService {
  // Upload file to IPFS via Pinata
  static async uploadFile(file, metadata = {}) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Add metadata
      const pinataMetadata = {
        name: metadata.name || `recording_${Date.now()}`,
        keyvalues: {
          type: 'recording',
          timestamp: new Date().toISOString(),
          ...metadata
        }
      }
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata))

      // Pinata options
      const pinataOptions = {
        cidVersion: 1,
        customPinPolicy: {
          regions: [
            {
              id: 'FRA1',
              desiredReplicationCount: 2
            },
            {
              id: 'NYC1',
              desiredReplicationCount: 2
            }
          ]
        }
      }
      formData.append('pinataOptions', JSON.stringify(pinataOptions))

      const response = await axios.post(
        API_ENDPOINTS.pinata.pinFile,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'pinata_api_key': API_CONFIG.pinata.apiKey,
            'pinata_secret_api_key': API_CONFIG.pinata.secretKey
          }
        }
      )

      return {
        success: true,
        data: {
          ipfsHash: response.data.IpfsHash,
          pinSize: response.data.PinSize,
          timestamp: response.data.Timestamp,
          url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        }
      }
    } catch (error) {
      console.error('Error uploading file to IPFS:', error)
      return { success: false, error: error.message }
    }
  }

  // Upload JSON data to IPFS
  static async uploadJSON(jsonData, metadata = {}) {
    try {
      const data = {
        pinataContent: jsonData,
        pinataMetadata: {
          name: metadata.name || `data_${Date.now()}`,
          keyvalues: {
            type: 'json',
            timestamp: new Date().toISOString(),
            ...metadata
          }
        },
        pinataOptions: {
          cidVersion: 1
        }
      }

      const response = await axios.post(
        API_ENDPOINTS.pinata.pinJson,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': API_CONFIG.pinata.apiKey,
            'pinata_secret_api_key': API_CONFIG.pinata.secretKey
          }
        }
      )

      return {
        success: true,
        data: {
          ipfsHash: response.data.IpfsHash,
          pinSize: response.data.PinSize,
          timestamp: response.data.Timestamp,
          url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        }
      }
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error)
      return { success: false, error: error.message }
    }
  }

  // Get file from IPFS
  static async getFile(ipfsHash) {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error)
      return { success: false, error: error.message }
    }
  }

  // List pinned files
  static async listFiles(metadata = {}) {
    try {
      const params = new URLSearchParams()
      
      if (metadata.type) {
        params.append('metadata[keyvalues][type][value]', metadata.type)
        params.append('metadata[keyvalues][type][op]', 'eq')
      }
      
      if (metadata.userId) {
        params.append('metadata[keyvalues][userId][value]', metadata.userId)
        params.append('metadata[keyvalues][userId][op]', 'eq')
      }

      const response = await axios.get(
        `https://api.pinata.cloud/data/pinList?${params.toString()}`,
        {
          headers: {
            'pinata_api_key': API_CONFIG.pinata.apiKey,
            'pinata_secret_api_key': API_CONFIG.pinata.secretKey
          }
        }
      )

      return {
        success: true,
        data: response.data.rows.map(item => ({
          ipfsHash: item.ipfs_pin_hash,
          size: item.size,
          timestamp: item.date_pinned,
          metadata: item.metadata,
          url: `https://gateway.pinata.cloud/ipfs/${item.ipfs_pin_hash}`
        }))
      }
    } catch (error) {
      console.error('Error listing files:', error)
      return { success: false, error: error.message }
    }
  }

  // Unpin file from IPFS
  static async unpinFile(ipfsHash) {
    try {
      await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`,
        {
          headers: {
            'pinata_api_key': API_CONFIG.pinata.apiKey,
            'pinata_secret_api_key': API_CONFIG.pinata.secretKey
          }
        }
      )

      return { success: true }
    } catch (error) {
      console.error('Error unpinning file:', error)
      return { success: false, error: error.message }
    }
  }

  // Create shareable recording package
  static async createRecordingPackage(recordingData, summary) {
    try {
      const packageData = {
        recording: {
          id: recordingData.recordingId,
          timestamp: recordingData.timestamp,
          duration: recordingData.duration,
          location: recordingData.location
        },
        summary,
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0',
          type: 'rightguard-recording-package'
        }
      }

      const result = await this.uploadJSON(packageData, {
        name: `recording_package_${recordingData.recordingId}`,
        type: 'recording-package',
        userId: recordingData.userId
      })

      return result
    } catch (error) {
      console.error('Error creating recording package:', error)
      return { success: false, error: error.message }
    }
  }

  // Mock IPFS upload for demo purposes
  static async mockUpload(file, metadata = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`
        resolve({
          success: true,
          data: {
            ipfsHash: mockHash,
            pinSize: file.size || 1024,
            timestamp: new Date().toISOString(),
            url: `https://gateway.pinata.cloud/ipfs/${mockHash}`
          }
        })
      }, 1500) // Simulate upload time
    })
  }
}

export default PinataService
