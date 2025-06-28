#include "DBConnector.hpp"

#include "UserCredentials.hpp"

#include <Poco/Data/PostgreSQL/PostgreSQLException.h>
#include <Poco/Data/Statement.h>
#include <Poco/Exception.h>
#include <Poco/Util/Application.h>
#include <cstring>
#include <string>
#include <regex>

using Poco::Data::Statement;
using namespace Poco::Data::Keywords;

DBConnector::DBConnector(Session& dbSession)
    : m_db(dbSession) {}

void DBConnector::createUser(UserCredentials user) {
  Statement sql(m_db);

  try {
    sql << "INSERT INTO users (name, username, email, salt, password_hash) "
           "VALUES ($1, $2, $3, $4, $5)",
        use(user.name), use(user.username), use(user.email), use(user.salt),
        use(user.passwordHash);

    sql.execute();
  } catch (Poco::Data::PostgreSQL::StatementException const& e) {
    if(strcmp(e.sqlState(), "23505") == 0) {
      std::regex regexp("Constraint: users_(username|email)_key");
      std::smatch match;
      if (std::regex_search(e.message(), match, regexp)) {
        if (match[1] == "username") {
          throw UsernameExistsException();
        } else if (match[1] == "email") {
          throw EmailExistsException();
        }
      }
    }
    throw;
  } catch (Poco::Exception const& e) {
    Poco::Util::Application::instance().logger().error(
        "[ERROR] DBConnector::createUser: Exception %s:\n%s\n",
        std::string(e.className()),
        e.displayText()
    );
    throw;
  }
}
