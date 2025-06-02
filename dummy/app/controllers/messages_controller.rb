class MessagesController < ApplicationController

  before_action :set_user
  def index
  end

  def create
    UserChannel[@user].state('user').merge({id: @user.id, name: "new name"})
    UserChannel[@user].state('$').append(key: "longString", value: " appended")
    UserChannel[@user].state('messages').push(message:params[:message])
    UserChannel[@user].state('messages[?(@.id==3)]').merge(message: "Hello AGAIN!")
    UserChannel[@user].state('records').upsert([{id: 1, name: "new1"}, {id: 2, name: "new2"}])
    UserChannel[@user].state('deeply.nested').set({value: "gotcha"})
    UserChannel[@user].state('val').delete "deleteme"
    UserChannel[@user].state('delete.array').delete name: 'deleteMe'
  end

  private
  def set_user
    @user = User.where(id: 1).first_or_create!(name: "henlo")
  end
end

