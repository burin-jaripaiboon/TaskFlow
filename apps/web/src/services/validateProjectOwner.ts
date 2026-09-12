import { useAuthStore } from "../stores/useAuthStore";
import api from "./api";

interface validatorProp {
  projectId?: string
  getResponse?: boolean
}

const validateProjectOwner = async ({ projectId, getResponse }: validatorProp) => {
  try {
    const userToken = useAuthStore.getState().accessToken;
    if (!userToken) throw new Error("Unauthorized access");
    const { userId } = JSON.parse(atob(userToken.split('.')[1]));
    const response = await api.get(`/projects/${projectId}`);
    const { ownerId } = response.data.data || response.data;

    if (userId !== ownerId) {
      throw new Error("You don't have permission.");
    }

    if (getResponse) {
      return response;
    }
  } catch (err: any) {
    console.error(err);
    throw new Error('Failed to validate project\'s owner.');
  }
};
export default validateProjectOwner;
