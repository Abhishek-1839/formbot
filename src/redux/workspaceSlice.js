import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../data/api';

// Fetch user's workspaces (including the default one created at signup)
export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/workspaces/get');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Share workspace with another user
export const shareWorkspace = createAsyncThunk(
  'workspaces/share',
  async ({ workspaceId, email, permission }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/workspaces/share', {
        workspaceId,
        email,
        permission
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error sharing workspace');
    }
  }
);

// Create a folder in workspace
export const createFolder = createAsyncThunk(
  'workspaces/createFolder',
  async ({ workspaceId, name }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/workspaces/${workspaceId}/folders`, { name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating folder');
    }
  }
);

// Delete a folder
export const deleteFolder = createAsyncThunk(
  'workspaces/deleteFolder',
  async ({ workspaceId, folderId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/workspaces/${workspaceId}/folders/${folderId}`
      );
      // Return the IDs from the response
      return {
        workspaceId,
        folderId,
        ...response.data
      };
    } catch (error) {
      console.error('Delete folder error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Error deleting folder' }
      );
    }
  }
);

// Create a typebot
export const createTypebot = createAsyncThunk(
  'workspaces/createTypebot',
  async ({ workspaceId, folderId, title, fields }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/workspaces/${workspaceId}/folders/${folderId}/typebots`,
        { title, fields }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating typebot');
    }
  }
);

// Delete a typebot
export const deleteTypebot = createAsyncThunk(
  'workspaces/deleteTypebot',
  async ({ workspaceId, folderId, formId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/workspaces/${workspaceId}/folders/${folderId}/typebots/${formId}`
      );
      // Return the IDs from the response
      return {
        workspaceId,
        folderId,
        formId,
        ...response.data
      };
    } catch (error) {
      console.error('Delete typebot error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Error deleting typebot' }
      );
    }
  }
);

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentWorkspace: JSON.parse(localStorage.getItem('currentWorkspace')) || null
    // currentWorkspace: JSON.parse(localStorage.getItem('currentWorkspace')) || null // Initialize from localStorage
  },
  reducers: {
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
      // localStorage.setItem('currentWorkspace', JSON.stringify(action.payload));
    },
    clearWorkspaces: (state) => {
      state.workspaces = [];
      state.currentWorkspace = null;
      localStorage.removeItem('currentWorkspaceId');
    },
    addFolderOptimistic: (state, action) => {
      const { workspaceId, folder } = action.payload;
      const workspace = state.items.find(w => w._id === workspaceId);
      if (workspace) {
        workspace.folders.push(folder);
        if (state.currentWorkspace?._id === workspaceId) {
          state.currentWorkspace = { ...workspace };
        }
      }
    },
    addTypebotOptimistic: (state, action) => {
      const { workspaceId, folderId, typebot } = action.payload;
      const workspace = state.items.find(w => w._id === workspaceId);
      if (workspace) {
        const folder = workspace.folders.find(f => f._id === folderId);
        if (folder) {
          workspace.forms.push(typebot);
          folder.forms.push(typebot._id);
          if (state.currentWorkspace?._id === workspaceId) {
            state.currentWorkspace = { ...workspace };
          }
        }
      }
  }
},

revertOptimisticUpdate: (state, action) => {
  // Revert to the previous state if the operation fails
  const { workspaceId, type, itemId } = action.payload;
  const workspace = state.items.find(w => w._id === workspaceId);
  if (workspace) {
    if (type === 'folder') {
      workspace.folders = workspace.folders.filter(f => f._id !== itemId);
    } else if (type === 'typebot') {
      workspace.forms = workspace.forms.filter(f => f._id !== itemId);
      workspace.folders.forEach(folder => {
        folder.forms = folder.forms.filter(f => f !== itemId);
      });
    }
    if (state.currentWorkspace?._id === workspaceId) {
      state.currentWorkspace = { ...workspace };
    }
  }
},
  extraReducers: (builder) => {
    builder
      // Fetch workspaces cases
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
        if (!state.currentWorkspace && action.payload.length > 0) {
          const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
          state.currentWorkspace = savedWorkspaceId
            ? action.payload.find(w => w._id === savedWorkspaceId)
            : action.payload[0];
        }
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch workspaces';
      })

      // Share workspace cases
      .addCase(shareWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        const updatedWorkspace = action.payload.workspace;
        const index = state.items.findIndex(w => w._id === updatedWorkspace._id);
        if (index !== -1) {
          state.items[index] = updatedWorkspace;
          if (state.currentWorkspace?._id === updatedWorkspace._id) {
            state.currentWorkspace = updatedWorkspace;
          }
        }
      })
      .addCase(shareWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create folder cases
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedWorkspace = action.payload;
        const index = state.items.findIndex(w => w._id === updatedWorkspace._id);
        if (index !== -1) {
          state.items[index] = updatedWorkspace;
          if (state.currentWorkspace?._id === updatedWorkspace._id) {
            state.currentWorkspace = updatedWorkspace;
          }
        }
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete folder cases
      .addCase(deleteFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.loading = false;
        const { workspaceId, folderId } = action.payload;
        const workspace = state.items.find(w => w._id === workspaceId);
        if (workspace) {
          workspace.folders = workspace.folders.filter(f => f._id !== folderId);
          if (state.currentWorkspace?._id === workspaceId) {
            state.currentWorkspace = { ...workspace };
          }
        }
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create typebot cases
      .addCase(createTypebot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTypebot.fulfilled, (state, action) => {
        state.loading = false;
        const updatedWorkspace = action.payload;
        const index = state.items.findIndex(w => w._id === updatedWorkspace._id);
        if (index !== -1) {
          state.items[index] = updatedWorkspace;
          if (state.currentWorkspace?._id === updatedWorkspace._id) {
            state.currentWorkspace = updatedWorkspace;
          }
        }
      })
      .addCase(createTypebot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete typebot cases
      .addCase(deleteTypebot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTypebot.fulfilled, (state, action) => {
        state.loading = false;
        const { workspaceId, folderId, formId } = action.payload;
        const workspace = state.items.find(w => w._id === workspaceId);
        if (workspace) {
          const folder = workspace.folders.find(f => f._id === folderId);
          if (folder) {
            folder.forms = folder.forms.filter(f => f !== formId);
            workspace.forms = workspace.forms.filter(f => f._id !== formId);
            if (state.currentWorkspace?._id === workspaceId) {
              state.currentWorkspace = { ...workspace };
            }
          }
        }
      })
      .addCase(deleteTypebot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentWorkspace, clearWorkspaces,addFolderOptimistic,
  addTypebotOptimistic,
  revertOptimisticUpdate } = workspaceSlice.actions;

// Selectors
export const selectWorkspaces = (state) => state.workspaces.items;
export const selectCurrentWorkspace = (state) => state.workspaces.currentWorkspace;
export const selectWorkspaceLoading = (state) => state.workspaces.loading;
export const selectWorkspaceError = (state) => state.workspaces.error;

export default workspaceSlice.reducer;


