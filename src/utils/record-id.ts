export function getValueId(value: unknown) {
  return value?.toString() ?? "";
}

export function getRecordId(record: { _id?: unknown }) {
  return getValueId(record._id);
}
