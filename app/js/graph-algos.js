var graphAlgos = {
  pathsFromTo: function (sourceArray, targetArray, limit) {
    return `UNWIND $sourceArray as source WITH source 
              UNWIND $targetArray as target 
              WITH source, target 
              match p=(a)-[rels*..${limit}]-(b) 
              WHERE id(a) = source and id(b) = target and NONE (r IN rels WHERE type(r)= 'belongs_to_compartment')  
              and  NONE (r IN rels WHERE type(r)= 'belongs_to_submap')
              and  NONE (r IN rels WHERE type(r)= 'belongs_to_complex')
              return nodes(p), relationships(p)`;
  },

  pathsBetween: function (idList, lengthLimit) {
    var query = `UNWIND $idList as a 
    UNWIND $idList as b 
    WITH   a, b 
    MATCH p=(n )-[rels*..${lengthLimit}]-(m)
    WHERE id(n) = a and id(m) = b and a <>b and NONE (r IN rels WHERE type(r)= 'belongs_to_compartment')  
            and  NONE (r IN rels WHERE type(r)= 'belongs_to_submap')
            and  NONE (r IN rels WHERE type(r)= 'belongs_to_complex')
            return nodes(p), relationships(p)`;
    return query;
  },
  neighborhood: function (idList, lengthLimit) {
    var query = `UNWIND $idList as ids
        MATCH p=(a)-[rels*..${lengthLimit}]-(b)
        WHERE id(a) = ids and  NONE (r IN rels WHERE type(r)= 'belongs_to_compartment')  
        and  NONE (r IN rels WHERE type(r)= 'belongs_to_submap')
        and  NONE (r IN rels WHERE type(r)= 'belongs_to_complex')
        RETURN nodes(p), relationships(p)`;
    return query;
  },
  commonStream: function (idList, lengthLimit) {
    var pageSize = 100000;
    var query = `CALL commonStream([${idList}], [], ${lengthLimit}, 1,
            ${pageSize}, 1, '', true, '', 0,{}, 0, 0, 0, 100000, [])`;
    return query;
  },
  upstream: function (idList, lengthLimit) {
    var pageSize = 100000;
    var query = `CALL commonStream([${idList}], [], ${lengthLimit}, 1,
            ${pageSize}, 1, '', true, '', 0,{}, 0, 0, 0, 100000, [])`;
    return query;
  },
  downstream: function (idList, lengthLimit) {
    var pageSize = 100000;
    var query = `CALL commonStream([${idList}], [], ${lengthLimit}, 0,
            ${pageSize}, 1, '', true, '', 0,{}, 0, 0, 0, 100000, [])`;
    return query;
  },
};
module.exports = graphAlgos;
