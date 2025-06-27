#pragma once
#include <Poco/Net/HTTPRequestHandlerFactory.h>

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPRequestHandlerFactory;
using Poco::Net::HTTPServerRequest;

class AuthRequestHandlerFactory : public HTTPRequestHandlerFactory {
public:
  HTTPRequestHandler* createRequestHandler(HTTPServerRequest const& request
  ) override;
};
