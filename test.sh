# #!/bin/bash

# # Base URLs
# USERS_URL="http://localhost:3000/api/users"

# # Colors for output
# GREEN='\033[0;32m'
# RED='\033[0;31m'
# NC='\033[0m' # No Color

# # Function to print section headers
# print_header() {
#     echo -e "\n${GREEN}=== $1 ===${NC}"
# }

# # Function to make API requests
# make_request() {
#     local method=$1
#     local endpoint=$2
#     local data=$3
    
#     echo "Request: $method $endpoint"
#     if [ -n "$data" ]; then
#         echo "Data: $data"
#     fi
    
#     if [ "$method" = "GET" ]; then
#         curl -s -X $method "$endpoint" | jq .
#     else
#         curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq .
#     fi
#     echo ""
# }

# # User-related functions
# test_get_all_users() {
#     print_header "Testing GET all users"
#     make_request "GET" "$USERS_URL"
# }

# test_get_user() {
#     print_header "Testing GET user by ID"
#     read -p "Enter user ID: " user_id
#     make_request "GET" "$USERS_URL/$user_id"
# }

# test_create_user() {
#     print_header "Testing POST create user"
#     read -p "Enter first name: " firstName
#     read -p "Enter last name: " lastName
#     read -p "Enter email: " email
    
#     local user_data=$(cat <<EOF
# {
#     "firstName": "$firstName",
#     "lastName": "$lastName",
#     "email": "$email"
# }
# EOF
# )
#     make_request "POST" "$USERS_URL" "$user_data"
# }

# test_update_user() {
#     print_header "Testing PUT update user"
#     read -p "Enter user ID to update: " user_id
#     read -p "Enter new first name (press Enter to keep current): " firstName
#     read -p "Enter new last name (press Enter to keep current): " lastName
#     read -p "Enter new email (press Enter to keep current): " email
    
#     local update_data="{"
#     local has_data=false
    
#     if [ -n "$firstName" ]; then
#         update_data+="\"firstName\": \"$firstName\""
#         has_data=true
#     fi
    
#     if [ -n "$lastName" ]; then
#         if [ "$has_data" = true ]; then
#             update_data+=","
#         fi
#         update_data+="\"lastName\": \"$lastName\""
#         has_data=true
#     fi
    
#     if [ -n "$email" ]; then
#         if [ "$has_data" = true ]; then
#             update_data+=","
#         fi
#         update_data+="\"email\": \"$email\""
#         has_data=true
#     fi
    
#     update_data+="}"
    
#     make_request "PUT" "$USERS_URL/$user_id" "$update_data"
# }

# test_delete_user() {
#     print_header "Testing DELETE user"
#     read -p "Enter user ID to delete: " user_id
#     make_request "DELETE" "$USERS_URL/$user_id"
# }

# # Submenu functions
# show_users_menu() {
#     echo -e "\n${GREEN}Users Menu${NC}"
#     echo "1. Get all users"
#     echo "2. Get user by ID"
#     echo "3. Create new user"
#     echo "4. Update user"
#     echo "5. Delete user"
#     echo "6. Back to main menu"
#     echo -n "Enter your choice (1-6): "
# }

# # Main menu
# show_main_menu() {
#     echo -e "\n${GREEN}API Testing Menu${NC}"
#     echo "1. Users"
#     echo "2. Exit"
#     echo -n "Enter your choice (1-2): "
# }

# # Main loop
# while true; do
#     show_main_menu
#     read choice
#     case $choice in
#         1)
#             while true; do
#                 show_users_menu
#                 read user_choice
#                 case $user_choice in
#                     1) test_get_all_users ;;
#                     2) test_get_user ;;
#                     3) test_create_user ;;
#                     4) test_update_user ;;
#                     5) test_delete_user ;;
#                     6) break ;;
#                     *) echo "Invalid choice. Please try again." ;;
#                 esac
#             done
#             ;;
#         2) echo "Exiting..."; exit 0 ;;
#         *) echo "Invalid choice. Please try again." ;;
#     esac
# done 


#!/bin/bash

# Base URLs
BASE_URL="http://localhost:3000/api"
USERS_URL="$BASE_URL/users"
POSTS_URL="$BASE_URL/posts"
LIKES_URL="$BASE_URL/likes"
FOLLOWS_URL="$BASE_URL/follows"
HASHTAGS_URL="$BASE_URL/hashtags"
FEED_URL="$BASE_URL/feed"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo -e "${YELLOW}Request: $method $endpoint${NC}"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    if [ "$method" = "GET" ] || [ "$method" = "DELETE" ]; then
        curl -s -X $method "$endpoint" | jq . 2>/dev/null || curl -s -X $method "$endpoint"
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq . 2>/dev/null || curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data"
    fi
    echo ""
}

# =====================
# USER FUNCTIONS
# =====================
test_get_all_users() {
    print_header "Testing GET all users"
    make_request "GET" "$USERS_URL"
}

test_get_user() {
    print_header "Testing GET user by ID"
    read -p "Enter user ID: " user_id
    make_request "GET" "$USERS_URL/$user_id"
}

test_create_user() {
    print_header "Testing POST create user"
    read -p "Enter first name: " firstName
    read -p "Enter last name: " lastName
    read -p "Enter email: " email
    
    local user_data=$(cat <<EOF
{
    "firstName": "$firstName",
    "lastName": "$lastName",
    "email": "$email"
}
EOF
)
    make_request "POST" "$USERS_URL" "$user_data"
}

test_update_user() {
    print_header "Testing PUT update user"
    read -p "Enter user ID to update: " user_id
    read -p "Enter new first name (or press Enter to skip): " firstName
    read -p "Enter new last name (or press Enter to skip): " lastName
    read -p "Enter new email (or press Enter to skip): " email
    
    local update_data="{"
    local has_data=false
    
    if [ -n "$firstName" ]; then
        update_data+="\"firstName\": \"$firstName\""
        has_data=true
    fi
    
    if [ -n "$lastName" ]; then
        if [ "$has_data" = true ]; then update_data+=","; fi
        update_data+="\"lastName\": \"$lastName\""
        has_data=true
    fi
    
    if [ -n "$email" ]; then
        if [ "$has_data" = true ]; then update_data+=","; fi
        update_data+="\"email\": \"$email\""
    fi
    
    update_data+="}"
    
    make_request "PUT" "$USERS_URL/$user_id" "$update_data"
}

test_delete_user() {
    print_header "Testing DELETE user"
    read -p "Enter user ID to delete: " user_id
    make_request "DELETE" "$USERS_URL/$user_id"
}

test_get_followers() {
    print_header "Testing GET user followers"
    read -p "Enter user ID: " user_id
    read -p "Enter limit (default 10): " limit
    read -p "Enter offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}
    make_request "GET" "$USERS_URL/$user_id/followers?limit=$limit&offset=$offset"
}

test_get_activity() {
    print_header "Testing GET user activity"
    read -p "Enter user ID: " user_id
    read -p "Enter limit (default 10): " limit
    read -p "Enter offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}
    make_request "GET" "$USERS_URL/$user_id/activity?limit=$limit&offset=$offset"
}

# =====================
# POST FUNCTIONS
# =====================
test_get_all_posts() {
    print_header "Testing GET all posts"
    make_request "GET" "$POSTS_URL"
}

test_get_post() {
    print_header "Testing GET post by ID"
    read -p "Enter post ID: " post_id
    make_request "GET" "$POSTS_URL/$post_id"
}

test_create_post() {
    print_header "Testing POST create post"
    read -p "Enter content: " content
    read -p "Enter author ID: " authorId
    
    local post_data=$(cat <<EOF
{
    "content": "$content",
    "authorId": $authorId
}
EOF
)
    make_request "POST" "$POSTS_URL" "$post_data"
}

test_update_post() {
    print_header "Testing PUT update post"
    read -p "Enter post ID to update: " post_id
    read -p "Enter new content: " content
    
    local update_data=$(cat <<EOF
{
    "content": "$content"
}
EOF
)
    make_request "PUT" "$POSTS_URL/$post_id" "$update_data"
}

test_delete_post() {
    print_header "Testing DELETE post"
    read -p "Enter post ID to delete: " post_id
    make_request "DELETE" "$POSTS_URL/$post_id"
}

# =====================
# LIKE FUNCTIONS
# =====================
test_like_post() {
    print_header "Testing POST like post"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    
    local like_data=$(cat <<EOF
{
    "userId": $userId,
    "postId": $postId
}
EOF
)
    make_request "POST" "$LIKES_URL" "$like_data"
}

test_unlike_post() {
    print_header "Testing DELETE unlike post"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    
    local unlike_data=$(cat <<EOF
{
    "userId": $userId,
    "postId": $postId
}
EOF
)
    make_request "DELETE" "$LIKES_URL" "$unlike_data"
}

# =====================
# FOLLOW FUNCTIONS
# =====================
test_follow_user() {
    print_header "Testing POST follow user"
    read -p "Enter follower ID: " followerId
    read -p "Enter following ID: " followingId
    
    local follow_data=$(cat <<EOF
{
    "followerId": $followerId,
    "followingId": $followingId
}
EOF
)
    make_request "POST" "$FOLLOWS_URL" "$follow_data"
}

test_unfollow_user() {
    print_header "Testing DELETE unfollow user"
    read -p "Enter follower ID: " followerId
    read -p "Enter following ID: " followingId
    
    local unfollow_data=$(cat <<EOF
{
    "followerId": $followerId,
    "followingId": $followingId
}
EOF
)
    make_request "DELETE" "$FOLLOWS_URL" "$unfollow_data"
}

# =====================
# HASHTAG FUNCTIONS
# =====================
test_add_hashtags_to_post() {
    print_header "Testing POST add hashtags to post"
    read -p "Enter post ID: " postId
    read -p "Enter hashtags (comma-separated, e.g., nodejs,typescript): " tags_input
    
    IFS=',' read -ra tags_array <<< "$tags_input"
    local tags_json=$(printf ',"%s"' "${tags_array[@]}")
    tags_json="[${tags_json:1}]"
    
    local hashtag_data=$(cat <<EOF
{
    "postId": $postId,
    "tags": $tags_json
}
EOF
)
    make_request "POST" "$HASHTAGS_URL/post" "$hashtag_data"
}

test_get_posts_by_hashtag() {
    print_header "Testing GET posts by hashtag"
    read -p "Enter hashtag (without #): " tag
    read -p "Enter limit (default 10): " limit
    read -p "Enter offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}
    make_request "GET" "$POSTS_URL/hashtag/$tag?limit=$limit&offset=$offset"
}

# =====================
# FEED FUNCTION
# =====================
test_get_feed() {
    print_header "Testing GET user feed"
    read -p "Enter user ID: " userId
    read -p "Enter limit (default 10): " limit
    read -p "Enter offset (default 0): " offset
    limit=${limit:-10}
    offset=${offset:-0}
    make_request "GET" "$FEED_URL?userId=$userId&limit=$limit&offset=$offset"
}

# =====================
# MENU FUNCTIONS
# =====================
show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Get user followers"
    echo "7. Get user activity"
    echo "8. Back to main menu"
    echo -n "Enter your choice (1-8): "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. Get all posts"
    echo "2. Get post by ID"
    echo "3. Create new post"
    echo "4. Update post"
    echo "5. Delete post"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_likes_menu() {
    echo -e "\n${GREEN}Likes Menu${NC}"
    echo "1. Like a post"
    echo "2. Unlike a post"
    echo "3. Back to main menu"
    echo -n "Enter your choice (1-3): "
}

show_follows_menu() {
    echo -e "\n${GREEN}Follows Menu${NC}"
    echo "1. Follow a user"
    echo "2. Unfollow a user"
    echo "3. Back to main menu"
    echo -n "Enter your choice (1-3): "
}

show_hashtags_menu() {
    echo -e "\n${GREEN}Hashtags Menu${NC}"
    echo "1. Add hashtags to post"
    echo "2. Get posts by hashtag"
    echo "3. Back to main menu"
    echo -n "Enter your choice (1-3): "
}

show_main_menu() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}   Social Media API Testing Menu${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo "1. Users"
    echo "2. Posts"
    echo "3. Likes"
    echo "4. Follows"
    echo "5. Hashtags"
    echo "6. Feed"
    echo "7. Exit"
    echo -n "Enter your choice (1-7): "
}

# =====================
# MAIN LOOP
# =====================
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) test_get_followers ;;
                    7) test_get_activity ;;
                    8) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        2)
            while true; do
                show_posts_menu
                read post_choice
                case $post_choice in
                    1) test_get_all_posts ;;
                    2) test_get_post ;;
                    3) test_create_post ;;
                    4) test_update_post ;;
                    5) test_delete_post ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        3)
            while true; do
                show_likes_menu
                read like_choice
                case $like_choice in
                    1) test_like_post ;;
                    2) test_unlike_post ;;
                    3) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        4)
            while true; do
                show_follows_menu
                read follow_choice
                case $follow_choice in
                    1) test_follow_user ;;
                    2) test_unfollow_user ;;
                    3) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        5)
            while true; do
                show_hashtags_menu
                read hashtag_choice
                case $hashtag_choice in
                    1) test_add_hashtags_to_post ;;
                    2) test_get_posts_by_hashtag ;;
                    3) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        6) test_get_feed ;;
        7) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
done