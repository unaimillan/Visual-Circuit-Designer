#include "app.hpp"
#include "api/AuthRequestHandlerFactory.hpp"
#include "api/DBConnector.hpp"
#include "api/PasswordHasher.hpp"
#include <Poco/Net/HTTPServerParams.h>
#include <Poco/Types.h>
#include <Poco/Util/ServerApplication.h>
#include <Poco/Net/ServerSocket.h>
#include <Poco/Net/HTTPServer.h>
#include <string>
#include <vector>

#include <Poco/Data/PostgreSQL/Connector.h>
#include <Poco/Data/Session.h>

using Poco::Net::ServerSocket;
using Poco::Net::HTTPServer;
using Poco::Net::HTTPServerParams;
using Poco::Data::Session;

void AppAuthServer::initialize(Application& self) {
    loadConfiguration();
    ServerApplication::initialize(self);
}

int AppAuthServer::main(const std::vector<std::string>& args) {
    Poco::Data::PostgreSQL::Connector::registerConnector();

    Session dbSession("PostgreSQL", "host=localhost port=5432 user=VCD password=12345 dbname=VCD");
    DBConnector db(dbSession);

    Poco::UInt16 port = config().getUInt16("HTTP.port");

    ServerSocket socket(port);
    HTTPServer httpServer(new AuthRequestHandlerFactory, socket, new HTTPServerParams);

    httpServer.start();
    waitForTerminationRequest();
    httpServer.stopAll();

    return ExitCode::EXIT_OK;
}
