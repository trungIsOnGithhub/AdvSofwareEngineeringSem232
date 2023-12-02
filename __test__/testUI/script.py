import time
import json
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException

MAX_TIME_WAIT = 1
TIME_TO_FULL_LOAD = 2
TEST_DOMAIN_LOCAL = "http://localhost:3000"
LOGIN_ENDPOINT = "/login"

class AutoSufer:
    def __init__(self, browser_driver):
        self.driver = browser_driver
	
    def click_button(self, xpath):
        button = self.driver.find_element(By.XPATH, xpath)
        button.click()

    def open_url(self, url):
        self.driver.get(url)

    def open(self):
        self.driver.get('https://google.com')

    def wait(self):
        # self.driver.implicitly_wait(TIME_TO_FULL_LOAD)
        time.sleep(MAX_TIME_WAIT)
        
    def quit(self):
        self.driver.quit()

class TestUILogin(AutoSufer):
    def open(self):
        self.open_url(TEST_DOMAIN_LOCAL + LOGIN_ENDPOINT)
        self.wait()
    
    def logout(self):
        self.open()

    def fill_login_input(self, email, password):
        input_field_list = self.driver.find_elements(By.CSS_SELECTOR, "input")

        for input_field in input_field_list:
            lc_placeholder_text = input_field.get_attribute("placeholder").lower()

            if lc_placeholder_text == "password":
                input_field.send_keys(password)
            elif lc_placeholder_text == "email":
                input_field.send_keys(email)

    # def get_landing_page_titles(self):
    #     title_element_list = self.driver.find_elements(By.CSS_SELECTOR, ".main-title > a")
    #     num_element = len(title_element_list)
    #     element_random_pick = random.randint(0, num_element-1)
    #     title_element_list[element_random_pick].click()
    #     self.driver.implicitly_wait(10)

    def click_login_button(self):
        xpath = '//*[@id="root"]/div[2]/div/div[2]/button'
        self.click_button(xpath)

    def is_login_fail_displayed(self):
        try:
            alert_box = self.driver.switch_to.alert
        except NoAlertPresentException:
            return False
        
        if alert_box.text.lower() == "wrong email or password":
            alert_box.accept()
            return True
        
        return False

    def is_student_after_login(self):
        try:
            page_title_xpath = '//*[@id="root"]/div[2]/div[1]/div[1]/h1'
            page_title = self.driver.find_element(By.XPATH, page_title_xpath)

            search_bar_xpath = '//*[@id="root"]/div[2]/div[1]/div[2]/input'
            search_bar = self.driver.find_element(By.XPATH, search_bar_xpath)
        except NoSuchElementException:
            return False

        if page_title.text == "Bài thi của tôi":
            return True

        return False

    def is_teacher_after_login(self):
        try:
            add_exam_button_xpath = '//*[@id="root"]/div[2]/button/a'
            add_exam_button = self.driver.find_element(By.XPATH, add_exam_button_xpath)

            page_title_xpath = '//*[@id="root"]/div[2]/h2'
            page_title =  self.driver.find_element(By.XPATH, page_title_xpath)
        except NoSuchElementException:
            return False
        # print(add_exam_button.get_attribute("href"))
        # print(add_exam_button.text.lower() == "add exam")
        # print(page_title.text.lower() == "exam list")
        if add_exam_button.text.lower() == "add exam" and add_exam_button.get_attribute("href") == TEST_DOMAIN_LOCAL+"/teacher/exams" and page_title.text.lower() == "exam list":
            return True

        return False

    def run(self, success, email, password, role, test_message):
        self.fill_login_input(email, password)
        self.click_login_button()

        self.wait()

        if not success:
            if self.is_login_fail_displayed():
                print(test_message + " SUCCESS")
            else:
                print(test_message + " SUCCESS")
            return

        if role == "student":
            if self.is_student_after_login():
                print(test_message + " SUCCESS")
            else:
                print(test_message + " FAILED")
        elif role == "teacher":
            if self.is_teacher_after_login():
                print(test_message + " SUCCESS")
            else:
                print(test_message + " FAILED")

        self.wait()

        self.logout()

if __name__ == "__main__":
    options = Options()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])

    test_ui = TestUILogin(webdriver.Chrome(options=options))

    with open('data.json') as test_data_file:
        test_data = json.loads( test_data_file.read() )
    
    # for test_item in test_data:
    #     print(test_item)
    #     print(type(test_item))

    test_ui.open()

    test_number = 1
    for data_set in test_data:
        is_login_success = bool(data_set['isValidCredential'])

        print("TEST: " + str(test_number))
        test_ui.run(is_login_success, data_set['email'], data_set['password'], data_set['role'], data_set['desiredOutput'], )

        test_number += 1

    test_ui.quit()

    