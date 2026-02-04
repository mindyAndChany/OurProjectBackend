import { Room } from '../models/room.model.js';

export type AddRoomInput = {
  name: string;
  number: string;
  is_computer_lab?: boolean;
  has_makren?: boolean;
  floor?: number;
  seat_count?: number;
  is_available?: boolean;
  primary_use?: string;
};

export type UpdateRoomInput = Partial<AddRoomInput>;

export const getRooms = async () => {
  return await Room.findAll();
};

export const getRoomById = async (id: number) => {
  return await Room.findByPk(id);
};

export const addRoom = async (data: AddRoomInput) => {
  return await Room.create(data as any);
};

export const updateRoomById = async (id: number, data: UpdateRoomInput) => {
  const item = await Room.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

export const deleteRoomById = async (id: number) => {
  const deleted = await Room.destroy({ where: { id } });
  return deleted > 0;
};
