#!/bin/bash

# Define the server configurations
declare -A serverConfigurations=(
    ["190.104.146.244"]=999
    ["140.246.149.224"]=8888
    ["101.255.94.161"]=8080
    ["117.2.28.235"]=55443
)

# Function to get a random server configuration
getRandomServerConfiguration() {
    local keys=("${!serverConfigurations[@]}")
    local randomKey=${keys[RANDOM % ${#keys[@]}]}
    echo "$randomKey:${serverConfigurations[$randomKey]}"
}

# Start the server
startServer() {
    local serverConfig
    serverConfig=$(getRandomServerConfiguration)
    IFS=':' read -r IPV4 PORT <<< "$serverConfig"

    # Check if the selected IP address is available
    if isAddressAvailable "$IPV4"; then
        node server.js "$IPV4" "$PORT"
    else
        echo "Address $IPV4 is not available."
    fi
}

# Check if the IP address is available
isAddressAvailable() {
    local ip=$1
    # Use a timeout to avoid long waits
    if ping -c 1 -W 1 "$ip" &> /dev/null; then
        return 0 # Address is available
    else
        return 1 # Address is not available
    fi
}

# Main execution
startServer
