#include "AuthRequestHandlerFactory.hpp"

#include "handlers/NotFoundHandler.hpp"

#include <Poco/Net/HTTPRequestHandler.h>
#include <Poco/Net/HTTPServerRequest.h>

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPServerRequest;

HTTPRequestHandler*
AuthRequestHandlerFactory::createRequestHandler(HTTPServerRequest const& request
) {
  return new NotFoundHandler;
}
