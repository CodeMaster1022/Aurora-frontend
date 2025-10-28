import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, Profile, ProfileFormData } from '../types/profile';
import { profileService } from '../services/profileService';

// Initial state
const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();
      return response.data.profile;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get profile'
      );
    }
  }
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (profileData: ProfileFormData, { rejectWithValue }) => {
    try {
      const response = await profileService.createProfile(profileData);
      return response.data.profile;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create profile'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: ProfileFormData, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(profileData);
      return response.data.profile;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update profile'
      );
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'profile/uploadPhoto',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadPhoto(file);
      return response.data.photoUrl;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to upload photo'
      );
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create profile
    builder
      .addCase(createProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Upload photo
    builder
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.photo = action.payload;
        }
        state.error = null;
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError, setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer; 