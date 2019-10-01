'use strict';

module.exports.getDataPagination = (size, pageNumber) => {
  const skip = size * (pageNumber - 1);
  const limit = Number(size);
  return {skip, limit};
};

module.exports.getTotalPages = (totalCount, size) => Math.ceil(totalCount / size);
