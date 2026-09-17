import api from "./api";

interface validatorProp {
  taskId: string;
  projectId: string;
  getResponse?: boolean;
}

const verifyTaskAddress = async ({ taskId, projectId, getResponse }: validatorProp) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    const taskData = response.data.data || response.data;

    if (projectId !== taskData.projectId) {
      throw new Error("This task is not related to this project!");
    }

    if (getResponse) {
      return response;
    }
  } catch (err: any) {
    console.error('Verify Task Error:', err);
    throw new Error('Failed to validate task\'s address.');
  }
};
export default verifyTaskAddress;
