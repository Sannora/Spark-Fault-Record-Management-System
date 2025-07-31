const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return []; // en az 1 başlık + 1 veri olmalı

  const headers = lines[0].split(',').map(h => h.trim());
  const records = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const record = {};

    headers.forEach((header, idx) => {
      record[header] = values[idx] ?? null;
    });

    return record;
  });

  return records;
};

module.exports = parseCSV;
