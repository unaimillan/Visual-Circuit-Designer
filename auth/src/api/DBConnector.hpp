#pragma once

#include "User.hpp"
#include "UserCredentials.hpp"

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

  void createUser(UserCredentials user);

private:
  Session& m_db;
};

class UsernameExistsException : public Poco::DataException {};

class EmailExistsException : public Poco::DataException {};

namespace Poco::Data {
  template<>
  class TypeHandler< struct User > {
  public:
    static void bind(
        size_t                    pos,
        User const&               obj,
        AbstractBinder::Ptr       pBinder,
        AbstractBinder::Direction dir
    ) {
      TypeHandler< int >::bind(pos++, obj.id, pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.username, pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.email, pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.name, pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.createdAt, pBinder, dir);
    }

    static size_t size() { return 5; }

    static void
    prepare(size_t pos, User const& obj, AbstractPreparator::Ptr pPrepare) {
      TypeHandler< int >::prepare(pos++, obj.id, pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.username, pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.email, pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.name, pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.createdAt, pPrepare);
    }

    static void extract(
        size_t pos, User& obj, User const& defVal, AbstractExtractor::Ptr pExt
    ) {
      int         id;
      std::string username;
      std::string email;
      std::string name;
      std::string createdAt;
      TypeHandler< int >::extract(pos++, id, defVal.id, pExt);
      TypeHandler< std::string >::extract(
          pos++, username, defVal.username, pExt
      );
      TypeHandler< std::string >::extract(pos++, email, defVal.email, pExt);
      TypeHandler< std::string >::extract(pos++, name, defVal.name, pExt);
      TypeHandler< std::string >::extract(
          pos++, createdAt, defVal.createdAt, pExt
      );
      obj.id        = id;
      obj.username  = username;
      obj.email     = email;
      obj.name      = name;
      obj.createdAt = createdAt;
    }
  };

  template<>
  class TypeHandler< struct UserCredentials > {
    static void bind(
        size_t                    pos,
        UserCredentials const&    obj,
        AbstractBinder::Ptr       pBinder,
        AbstractBinder::Direction dir
    ) {
      TypeHandler< User >::bind(pos, obj, pBinder, dir);
      pos += TypeHandler< User >::size();
      TypeHandler< std::string >::bind(pos++, obj.passwordHash, pBinder, dir);
      TypeHandler< std::string >::bind(pos++, obj.salt, pBinder, dir);
    }

    static size_t size() { return TypeHandler< User >::size() + 2; }

    static void prepare(
        size_t pos, UserCredentials const& obj, AbstractPreparator::Ptr pPrepare
    ) {
      TypeHandler< User >::prepare(pos, obj, pPrepare);
      pos += TypeHandler< User >::size();
      TypeHandler< std::string >::prepare(pos++, obj.passwordHash, pPrepare);
      TypeHandler< std::string >::prepare(pos++, obj.salt, pPrepare);
    }

    static void extract(
        size_t                 pos,
        UserCredentials&       obj,
        UserCredentials const& defVal,
        AbstractExtractor::Ptr pExt
    ) {
      TypeHandler< User >::extract(pos, obj, defVal, pExt);
      pos += TypeHandler< User >::size();
      TypeHandler< std::string >::extract(
          pos++, obj.passwordHash, defVal.passwordHash, pExt
      );
      TypeHandler< std::string >::extract(pos++, obj.salt, defVal.salt, pExt);
    }
  };
} // namespace Poco::Data
