self.onmessage = (e) => {
  const { rows, filters, requestId } = e.data;

  const normalize = (v: string) => v.trim();

  // Pre-build filter sets (O(1) lookups)
  const acadYearSet = filters.acadYear?.length
    ? new Set(filters.acadYear.map(normalize))
    : null;

  const scholarshipTypeSet = filters.scholarshipType?.length
    ? new Set(filters.scholarshipType.map(normalize))
    : null;

  const categorySet = filters.categories?.length
    ? new Set(filters.categories.map(normalize))
    : null;

  const schoolSet = filters.school?.length
    ? new Set(filters.school.map(normalize))
    : null;

  const schoolClassificationSet = filters.schoolClassification?.length
    ? new Set(filters.schoolClassification.map(normalize))
    : null;

  // Fast path: no filters applied → return rows immediately
  if (
    !acadYearSet &&
    !scholarshipTypeSet &&
    !categorySet &&
    !schoolSet &&
    !schoolClassificationSet
  ) {
    self.postMessage(rows);
    return;
  }

  const filtered = rows.filter((r) => {
    if (acadYearSet && !acadYearSet.has(normalize(r["ACADEMIC YEAR COVER"]))) return false;
    if (scholarshipTypeSet && !scholarshipTypeSet.has(normalize(r["SCHOLARSHIP TYPE"]))) return false;
    if (categorySet && !categorySet.has(normalize(r["SCHOLARSHIP CATEGORY"]))) return false;
    if (schoolSet && !schoolSet.has(normalize(r["SCHOOL NAME"]))) return false;
    if (
      schoolClassificationSet &&
      !schoolClassificationSet.has(normalize(r["SCHOOL CLASSIFICATION"]))
    ) return false;

    return true;
  });

  self.postMessage({ requestId, data: filtered });
};
