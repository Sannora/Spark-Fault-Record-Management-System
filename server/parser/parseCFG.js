function parseCFG(text) {
  const lines = text.split('\n').map(line => line.trim());
  const result = {
    fider: {},
    measurements: [],
    protection_states: [],
    binary_inputs: [],
    time_range: {},
    format: "",
    record_id: null
  };

  for (let line of lines) {
    if (line.startsWith('H') && line.includes(',')) {
      // Örneğin: H10_FIDER_H,10.1.126.10,1999
      const parts = line.split(',');
      result.fider = {
        name: parts[0],
        ip: parts[1],
        port: parseInt(parts[2], 10)
      };
    }
    // Ölçümler: örn "1,IL1,A,,A,0.78125,0,0,-32767,32767,200,5,P"
    else if (/^\d+,(IL[123]|Io|Uo|U1|U2|U3),/.test(line)) {
      const parts = line.split(',');
      result.measurements.push({
        id: parseInt(parts[0], 10),
        code: parts[1],
        phase: parts[2],
        unit: parts[4],                // Burada unit düzeltilmiş
        scale: parseFloat(parts[5]),  // scale düzeltilmiş
        max: parseFloat(parts[10]),
        min: parseFloat(parts[11])
      });
    }
    // Koruma durumları, örn: "1,67-1(1) pick up,,,0"
    else if (line.match(/^\d+,.+pick up|trip/)) {
      const parts = line.split(',');
      result.protection_states.push({
        id: parseInt(parts[0], 10),
        code: parts[1].trim(),
        value: parts[4] !== undefined ? parseInt(parts[4], 10) : null
      });
    }
    // Binary input satırları, örn: "25,Binary ch 25 input,,,0"
    else if (line.match(/^\d+,Binary ch \d+ input/)) {
      const parts = line.split(',');
      result.binary_inputs.push({
        id: parseInt(parts[0], 10),
        name: parts[1].trim(),
        value: parts[4] !== undefined ? parseInt(parts[4], 10) : null
      });
    }
    // Zaman aralığı başlangıcı ve sonu
    else if (line.startsWith('t1:')) {
      result.time_range.start = line.replace('t1:', '').trim();
    } else if (line.startsWith('t2:')) {
      result.time_range.end = line.replace('t2:', '').trim();
    }
    // Format bilgisi
    else if (line.startsWith('Format:')) {
      result.format = line.split(':')[1].trim();
    }
    // Kayıt ID'si
    else if (line.startsWith('Record:')) {
      result.record_id = parseInt(line.split(':')[1].trim(), 10);
    }
  }

  return result;
}

module.exports = parseCFG;
