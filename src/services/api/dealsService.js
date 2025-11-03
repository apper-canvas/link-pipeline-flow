const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const dealsService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "moved_to_stage_at_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "moved_to_stage_at_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('deal_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  },

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "moved_to_stage_at_c"}}
        ],
        where: [
          {
            "FieldName": "contact_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(contactId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching deals for contact ${contactId}:`, error?.response?.data?.message || error.message);
      return [];
    }
  },

  async create(dealData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          contact_id_c: parseInt(dealData.contact_id_c),
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c),
          stage_c: dealData.stage_c,
          expected_close_date_c: dealData.expected_close_date_c,
          created_at_c: new Date().toISOString(),
          moved_to_stage_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error(`Failed to create deal:`, result);
          throw new Error(result.message || 'Deal creation failed');
        }
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      // Only include Updateable fields
      const updateFields = {};
      if (dealData.contact_id_c !== undefined) updateFields.contact_id_c = parseInt(dealData.contact_id_c);
      if (dealData.title_c !== undefined) updateFields.title_c = dealData.title_c;
      if (dealData.value_c !== undefined) updateFields.value_c = parseFloat(dealData.value_c);
      if (dealData.stage_c !== undefined) {
        updateFields.stage_c = dealData.stage_c;
        // Update moved_to_stage_at when stage changes
        updateFields.moved_to_stage_at_c = new Date().toISOString();
      }
      if (dealData.expected_close_date_c !== undefined) updateFields.expected_close_date_c = dealData.expected_close_date_c;
      if (dealData.created_at_c !== undefined) updateFields.created_at_c = dealData.created_at_c;
      if (dealData.moved_to_stage_at_c !== undefined) updateFields.moved_to_stage_at_c = dealData.moved_to_stage_at_c;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };
      
      const response = await apperClient.updateRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error(`Failed to update deal:`, result);
          throw new Error(result.message || 'Deal update failed');
        }
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('deal_c', params);
      
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
      console.error("Error deleting deal:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};