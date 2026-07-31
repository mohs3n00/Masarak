
import { apiClient } from '../../../shared/api/api.client';
import { AcademicConversation, AcademicMessage } from '../types';

export const ConversationsApi = {
  getConversations: (params?: any) => 
    apiClient.get<AcademicConversation[]>('/academic-conversations', { params }),
    
  getConversation: (id: string) => 
    apiClient.get<AcademicConversation>(`/academic-conversations/${id}`),
    
  createConversation: (data: any) => 
    apiClient.post<AcademicConversation>('/academic-conversations', data),
    
  sendMessage: (conversationId: string, data: any) => 
    apiClient.post<AcademicMessage>(`/academic-conversations/${conversationId}/messages`, data),

  deleteConversation: (id: string) => 
    apiClient.delete(`/academic-conversations/${id}`),
};
