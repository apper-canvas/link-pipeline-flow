import React from "react";
import Error from "@/components/ui/Error";
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const contactsService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "last_contacted_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "last_contacted_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById('contact_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  },

  async create(contactData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          name_c: contactData.name_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          company_c: contactData.company_c,
          notes_c: contactData.notes_c,
          last_contacted_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error(`Failed to create contact:`, result);
          throw new Error(result.message || 'Contact creation failed');
        }
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      // Only include Updateable fields
      const updateFields = {};
      if (contactData.name_c !== undefined) updateFields.name_c = contactData.name_c;
      if (contactData.email_c !== undefined) updateFields.email_c = contactData.email_c;
      if (contactData.phone_c !== undefined) updateFields.phone_c = contactData.phone_c;
      if (contactData.company_c !== undefined) updateFields.company_c = contactData.company_c;
      if (contactData.notes_c !== undefined) updateFields.notes_c = contactData.notes_c;
      if (contactData.last_contacted_at_c !== undefined) updateFields.last_contacted_at_c = contactData.last_contacted_at_c;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };
      
      const response = await apperClient.updateRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error(`Failed to update contact:`, result);
          throw new Error(result.message || 'Contact update failed');
        }
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return result.success;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error.message);
throw error;
    }
  }
};