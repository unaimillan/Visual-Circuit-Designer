#include "AuthRequestHandlerFactory.hpp"

#include "DBConnector.hpp"
#include "handlers/NotFoundHandler.hpp"
#include "handlers/RegistrationHandler.hpp"

#include <Poco/Net/HTTPRequestHandler.h>
#include <Poco/Net/HTTPServerRequest.h>

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPServerRequest;

AuthRequestHandlerFactory::AuthRequestHandlerFactory(DBConnector& db)
    : m_db(db) {}

HTTPRequestHandler*
AuthRequestHandlerFactory::createRequestHandler(HTTPServerRequest const& request
) {
  if (request.getMethod() == "POST") {
    if (request.getURI() == "/api/register") {
      return new RegistrationHandler(m_db);
    }
  }
  return new NotFoundHandler;
}
