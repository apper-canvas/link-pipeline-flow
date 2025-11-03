const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const activitiesService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "type_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByContactId(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "type_c"}}
        ],
        where: [
          {
            "FieldName": "contact_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(contactId)]
          }
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for contact ${contactId}:`, error?.response?.data?.message || error.message);
      return [];
    }
  },

  async create(activityData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          contact_id_c: parseInt(activityData.contact_id_c),
          description_c: activityData.description_c,
          type_c: activityData.type_c,
          timestamp_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error(`Failed to create activity:`, result);
          throw new Error(result.message || 'Activity creation failed');
        }
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, activityData) {
    try {
      // Only include Updateable fields
      const updateFields = {};
      if (activityData.contact_id_c !== undefined) updateFields.contact_id_c = parseInt(activityData.contact_id_c);
      if (activityData.description_c !== undefined) updateFields.description_c = activityData.description_c;
      if (activityData.type_c !== undefined) updateFields.type_c = activityData.type_c;
      if (activityData.timestamp_c !== undefined) updateFields.timestamp_c = activityData.timestamp_c;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };
      
      const response = await apperClient.updateRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error(`Failed to update activity:`, result);
          throw new Error(result.message || 'Activity update failed');
        }
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('activity_c', params);
      
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
      console.error("Error deleting activity:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};