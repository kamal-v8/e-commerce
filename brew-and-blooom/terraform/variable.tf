variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

#  variable "my_ip" {
#     description = "public ip for ssh"
#     type = string
#     default= "2405:201:d000:c231:16d4:24ff:fe1a:ebdd" #curl ifconfig.me 
#  }
# variable "my_ip_ipv4" {
#     description = "public ipv4 for ssh"
#     type = string
#     default = "49.43.240.248/32"
# }
