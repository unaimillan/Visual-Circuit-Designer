#pragma once

#include "User.hpp"

#include <Poco/Data/AbstractBinder.h>
#include <Poco/Data/AbstractExtractor.h>
#include <Poco/Data/AbstractPreparator.h>
#include <Poco/Data/Session.h>
#include <Poco/Data/TypeHandler.h>
#include <cstddef>
#include <string>

using Poco::Data::Session;

class DBConnector {
public:
  explicit DBConnector(Session& dbSession);

private:
  Session& m_db;
};

namespace Poco::Data {
  template<>
  class TypeHandler< class User > {
    static void bind(
        size_t                    pos,
        User const&               obj,
        AbstractBinder::Ptr       pBinder,
        AbstractBinder::Direction dir
    ) {
      TypeHandler< int >::bind(pos++, obj.getId(), pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.getUsername(), pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.getEmail(), pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.getName(), pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.getCreatedAt(), pBinder, dir);
    }

    static size_t size() { return 5; }

    static void
    prepare(size_t pos, User const& obj, AbstractPreparator::Ptr pPrepare) {
      TypeHandler< int >::prepare(pos++, obj.getId(), pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.getUsername(), pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.getEmail(), pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.getName(), pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.getCreatedAt(), pPrepare);
    }

    static void extract(
        size_t pos, User& obj, User const& defVal, AbstractExtractor::Ptr pExt
    ) {
      int         id;
      std::string username;
      std::string email;
      std::string name;
      std::string createdAt;
      TypeHandler< int >::extract(pos++, id, defVal.getId(), pExt);
      TypeHandler< std::string >::extract(
          pos++, username, defVal.getUsername(), pExt
      );
      TypeHandler< std::string >::extract(
          pos++, email, defVal.getEmail(), pExt
      );
      TypeHandler< std::string >::extract(pos++, name, defVal.getName(), pExt);
      TypeHandler< std::string >::extract(
          pos++, createdAt, defVal.getCreatedAt(), pExt
      );
      obj.setId(id);
      obj.setUsername(username);
      obj.setEmail(email);
      obj.setName(name);
      obj.setCreatedAt(createdAt);
    }
  };
} // namespace Poco::Data
